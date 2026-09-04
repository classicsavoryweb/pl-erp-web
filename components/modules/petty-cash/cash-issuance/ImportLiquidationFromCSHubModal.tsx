"use client";

import { useRef, useState } from "react";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import Checkbox from "@/components/common/Checkbox";
import Textfield from "@/components/common/Textfield";
import confirm from "@/components/common/Confirm";
import { toast } from "react-toastify";
import { useAsyncEffect } from "@/hooks/async-effect";
import moment from "moment";
import { getCSHubLiquidationCandidates, importCSHubLiquidations } from "@/api/petty-cash/liquidation";

interface ImportLiquidationFromCSHubModalProps {
    modal: any;
    issuance: any;
    onImported: () => void;
}

const formatAmount = (value: any) =>
    value != null && value !== ""
        ? Number(value).toLocaleString("en-PH", { style: "currency", currency: "PHP" })
        : "—";

const getDefaultDateRange = () => ({
    approved_from: moment().subtract(3, "months").startOf("month").format("YYYY-MM-DD"),
    approved_to: moment().format("YYYY-MM-DD"),
});

const ImportLiquidationFromCSHubModal = ({ modal, issuance, onImported }: ImportLiquidationFromCSHubModalProps) => {
    const [loading, setLoading] = useState(false);
    const [importing, setImporting] = useState(false);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [selectedIds, setSelectedIds] = useState<any[]>([]);
    const [dateRange, setDateRange] = useState(getDefaultDateRange());
    const isImportingRef = useRef(false);

    const loadCandidates = (range: { approved_from: string; approved_to: string }) => {
        if (!issuance?.id) return;
        setLoading(true);
        setSelectedIds([]);
        getCSHubLiquidationCandidates(issuance.id, range)
            .then((resp) => {
                if (!resp.error) {
                    setTransactions(resp.data.transactions ?? []);
                } else {
                    toast.error(resp.data?.message || "Error fetching CS Hub liquidations");
                }
            })
            .catch(() => toast.error("Error encountered"))
            .finally(() => setLoading(false));
    };

    useAsyncEffect(() => {
        if (!modal.isShowing) return;
        const defaults = getDefaultDateRange();
        setDateRange(defaults);
        loadCandidates(defaults);
    }, [modal.isShowing, issuance?.id]);

    const importableTransactions = transactions.filter((t) => t.importable);
    const allSelected = importableTransactions.length > 0 && selectedIds.length === importableTransactions.length;

    const toggleOne = (cshubId: any) => {
        setSelectedIds((prev) =>
            prev.includes(cshubId) ? prev.filter((id) => id !== cshubId) : [...prev, cshubId]
        );
    };

    const toggleAll = () => {
        setSelectedIds(allSelected ? [] : importableTransactions.map((t) => t.cshub_id));
    };

    const handleSearch = () => {
        loadCandidates(dateRange);
    };

    const handleImport = async () => {
        if (isImportingRef.current || selectedIds.length === 0) return;

        const isConfirmed = await confirm({
            title: "Import Liquidation from CS Hub",
            message: `Are you sure you want to import ${selectedIds.length} liquidation record(s) for this cash issuance from CS Hub?`,
        });
        if (!isConfirmed) return;

        isImportingRef.current = true;
        setImporting(true);
        importCSHubLiquidations(issuance.id, { cshub_ids: selectedIds, ...dateRange })
            .then((resp) => {
                if (!resp.error) {
                    const results = resp.data.results ?? [];
                    const successCount = results.filter((r: any) => r.success).length;
                    const failed = results.filter((r: any) => !r.success);
                    if (successCount > 0) {
                        toast.success(`${successCount} liquidation(s) imported successfully.`);
                    }
                    failed.forEach((r: any) => toast.error(r.message));
                    onImported();
                    modal.onClose();
                } else {
                    toast.error(resp.data?.message || "Error importing liquidations");
                }
            })
            .catch(() => toast.error("Error encountered"))
            .finally(() => {
                setImporting(false);
                isImportingRef.current = false;
            });
    };

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Import Liquidation from CS Hub"
            onClose={modal.onClose}
            size="xxl"
        >
            <div className="grid grid-cols-4 gap-4 items-end mb-4">
                <Textfield
                    label="Approved From"
                    name="approved_from"
                    type="date"
                    value={dateRange.approved_from}
                    onChange={(e) => setDateRange((prev) => ({ ...prev, approved_from: e.target.value }))}
                />
                <Textfield
                    label="Approved To"
                    name="approved_to"
                    type="date"
                    value={dateRange.approved_to}
                    onChange={(e) => setDateRange((prev) => ({ ...prev, approved_to: e.target.value }))}
                />
                <Button label="Search" onClick={handleSearch} loading={loading} />
            </div>

            <div className="flex items-center justify-between mb-2">
                <Checkbox
                    label={`Select All (${importableTransactions.length} importable)`}
                    value="all"
                    checked={allSelected}
                    onChange={toggleAll}
                />
                <p className="text-sm text-gray-500 dark:text-neutral-400">{selectedIds.length} selected</p>
            </div>

            <div className="overflow-auto border dark:border-neutral-600 rounded min-h-[220px] max-h-[420px]">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 dark:bg-neutral-800 sticky top-0">
                        <tr>
                            <th className="text-left px-3 py-2 whitespace-nowrap"></th>
                            <th className="text-left px-3 py-2 whitespace-nowrap">Trans No.</th>
                            <th className="text-left px-3 py-2 whitespace-nowrap">Liquidation Date</th>
                            <th className="text-right px-3 py-2 whitespace-nowrap">Actual Amount Spent</th>
                            <th className="text-left px-3 py-2">Remarks</th>
                            <th className="text-left px-3 py-2 whitespace-nowrap">Attachments</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="text-center py-6 text-gray-400">Loading...</td>
                            </tr>
                        ) : transactions.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-6 text-gray-400">
                                    No liquidation found on CS Hub for this cash issuance yet.
                                </td>
                            </tr>
                        ) : (
                            transactions.map((t) => (
                                <tr key={t.cshub_id} className="border-t dark:border-neutral-600">
                                    <td className="px-3 py-2">
                                        {t.importable ? (
                                            <Checkbox
                                                value={t.cshub_id}
                                                checked={selectedIds.includes(t.cshub_id)}
                                                onChange={() => toggleOne(t.cshub_id)}
                                            />
                                        ) : (
                                            <span className="text-gray-300">—</span>
                                        )}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap font-mono text-xs">{t.trans_no ?? "—"}</td>
                                    <td className="px-3 py-2 whitespace-nowrap">{t.liquidation_date_filed ?? "—"}</td>
                                    <td className="px-3 py-2 text-right whitespace-nowrap">{formatAmount(t.actual_amount_spent)}</td>
                                    <td className="px-3 py-2">{t.liquidation_remarks}</td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                        {t.attachment_count} file(s)
                                        {t.already_imported && (
                                            <span className="ml-2 text-xs text-red-500">Already imported.</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <hr className="mt-5 mb-3 border-slate-200 dark:border-neutral-700" />
            <div className="flex justify-end gap-x-2">
                <Button label="Cancel" variant="secondary" onClick={modal.onClose} />
                <Button
                    label={`Import Selected (${selectedIds.length})`}
                    loading={importing}
                    disabled={selectedIds.length === 0}
                    onClick={handleImport}
                />
            </div>
        </Modal>
    );
};

export default ImportLiquidationFromCSHubModal;
