"use client";

import { useRef, useState } from "react";
import moment from "moment";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import confirm from "@/components/common/Confirm";
import { toast } from "react-toastify";
import { useAsyncEffect } from "@/hooks/async-effect";
import {
    getPendingCashIssuancesForReplenishment,
    createReplenishment,
} from "@/api/petty-cash/replenishment";

interface CreateReplenishmentFormProps {
    modal: any;
    custodianBranches: any[];
    onSubmitCallback: () => void;
}

const formatPCV = (pcvNumber: any, cshubTransNo: any) =>
    cshubTransNo ? `${pcvNumber} (${cshubTransNo})` : pcvNumber;

const formatAmount = (value: any) =>
    value != null && value !== ""
        ? Number(value).toLocaleString("en-PH", { style: "currency", currency: "PHP" })
        : "—";

// baliktad ipapakita, kabaligtaran ng raw value sa db (same sa cash issuance)
const renderOverUnder = (value: any) => {
    if (value == null || value === "") return <span className="text-gray-400">—</span>;
    const val = Number(value);
    const formatted = Math.abs(val).toLocaleString("en-PH", { style: "currency", currency: "PHP" });
    if (val === 0) return <span>{formatted}</span>;
    return val < 0
        ? <span className="text-green-600 dark:text-green-400">+{formatted}</span>
        : <span className="text-red-600 dark:text-red-400">-{formatted}</span>;
};

const CreateReplenishmentForm = ({ modal, custodianBranches, onSubmitCallback }: CreateReplenishmentFormProps) => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [issuances, setIssuances] = useState<any[]>([]);
    const [totalCashIssuanceAmount, setTotalCashIssuanceAmount] = useState(0);
    const [totalOverunderAmount, setTotalOverunderAmount] = useState(0);
    const [totalUnliquidatedAmount, setTotalUnliquidatedAmount] = useState(0);
    const [totalReplenishmentAmount, setTotalReplenishmentAmount] = useState(0);
    const isSubmittingRef = useRef(false);

    useAsyncEffect(() => {
        if (!modal.isShowing) return;
        setLoading(true);
        getPendingCashIssuancesForReplenishment()
            .then((resp) => {
                if (!resp.error) {
                    setIssuances(resp.data.issuances ?? []);
                    setTotalCashIssuanceAmount(resp.data.total_cash_issuance_amount ?? 0);
                    setTotalOverunderAmount(resp.data.total_overunder_amount ?? 0);
                    setTotalUnliquidatedAmount(resp.data.total_unliquidated_amount ?? 0);
                    setTotalReplenishmentAmount(resp.data.total_replenishment_amount ?? 0);
                } else {
                    toast.error(resp.data?.message || "Error loading pending transactions");
                }
            })
            .catch(() => toast.error("Error encountered"))
            .finally(() => setLoading(false));
    }, [modal.isShowing]);

    const handleSave = async () => {
        if (isSubmittingRef.current) return;
        isSubmittingRef.current = true;
        try {
            const isConfirmed = await confirm({
                title: "Add Replenishment",
                message: `Are you sure you want to create a replenishment for ${issuances.length} transaction(s)?`,
            });

            if (!isConfirmed) return;

            setSaving(true);
            await createReplenishment()
                .then((resp) => {
                    if (!resp.error) {
                        toast.success("Replenishment created successfully.");
                        modal.onClose();
                        onSubmitCallback();
                    } else {
                        toast.error(resp.data?.message || "Error creating replenishment.");
                    }
                })
                .catch(() => toast.error("Error encountered."));
        } finally {
            setSaving(false);
            isSubmittingRef.current = false;
        }
    };

    const branchNames = custodianBranches.map((b: any) => b.name).join(", ");

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Add Replenishment"
            onClose={modal.onClose}
            size="xxl"
        >
            <div className="flex flex-col gap-4 bg-gray-100 dark:bg-neutral-800 rounded p-3 mb-4 text-sm">
                <div className="grid grid-cols-4 gap-4">
                    <div>
                        <p className="text-gray-500 dark:text-neutral-400 font-semibold text-xs mb-1">Replenishment ID</p>
                        <p className="font-medium">—</p>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-neutral-400 font-semibold text-xs mb-1">Transaction Date</p>
                        <p className="font-medium">{moment().format("YYYY-MM-DD")}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-neutral-400 font-semibold text-xs mb-1">Status</p>
                        <p className="font-medium">Pending</p>
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    <div>
                        <p className="text-gray-500 dark:text-neutral-400 font-semibold text-xs mb-1">Total Cash Issuance Amount</p>
                        <p className="font-medium">{formatAmount(totalCashIssuanceAmount)}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-neutral-400 font-semibold text-xs mb-1">Total Over/Under Amount</p>
                        <p className="font-medium">{renderOverUnder(totalOverunderAmount)}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-neutral-400 font-semibold text-xs mb-1">Total Unliquidated Amount</p>
                        <p className="font-medium">{formatAmount(totalUnliquidatedAmount)}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-neutral-400 font-semibold text-xs mb-1">Total Replenishment</p>
                        <p className="font-medium">{formatAmount(totalReplenishmentAmount)}</p>
                    </div>
                </div>
                <div>
                    <p className="text-gray-500 dark:text-neutral-400 font-semibold text-xs mb-1">Branches</p>
                    <p className="font-medium">{branchNames || "—"}</p>
                </div>
            </div>

            <p className="font-semibold text-sm mb-2">Unliquidated &amp; Liquidated Transactions (as of today)</p>

            <div className="overflow-x-auto border dark:border-neutral-600 rounded min-h-[220px]">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 dark:bg-neutral-800">
                        <tr>
                            <th className="text-left px-3 py-2 whitespace-nowrap">PCV Number</th>
                            <th className="text-left px-3 py-2 whitespace-nowrap">Date</th>
                            <th className="text-left px-3 py-2 whitespace-nowrap">Branch</th>
                            <th className="text-left px-3 py-2 whitespace-nowrap">Requested By</th>
                            <th className="text-right px-3 py-2 whitespace-nowrap">Cash Issuance Amount</th>
                            <th className="text-right px-3 py-2 whitespace-nowrap">Unliquidated Amount</th>
                            <th className="text-right px-3 py-2 whitespace-nowrap">Over/Under Amount</th>
                            <th className="text-left px-3 py-2 whitespace-nowrap">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={8} className="text-center py-6 text-gray-400">Loading...</td>
                            </tr>
                        ) : issuances.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-center py-6 text-gray-400">
                                    No unliquidated or liquidated transactions found to replenish.
                                </td>
                            </tr>
                        ) : (
                            issuances.map((row) => (
                                <tr key={row.id} className="border-t dark:border-neutral-600">
                                    <td className="px-3 py-2 whitespace-nowrap font-mono text-xs">{formatPCV(row.pcv_number, row.cshub_trans_no)}</td>
                                    <td className="px-3 py-2 whitespace-nowrap">{row.date}</td>
                                    <td className="px-3 py-2 whitespace-nowrap">{row.branch?.name ?? "—"}</td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                        {row.requested_by ? `${row.requested_by.last_name}, ${row.requested_by.first_name}` : "—"}
                                    </td>
                                    <td className="px-3 py-2 text-right whitespace-nowrap">{formatAmount(row.amount)}</td>
                                    <td className="px-3 py-2 text-right whitespace-nowrap">{formatAmount(row.unliquidated_amount)}</td>
                                    <td className="px-3 py-2 text-right whitespace-nowrap">{renderOverUnder(row.overunder_amount)}</td>
                                    <td className="px-3 py-2 whitespace-nowrap">{row.status}</td>
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
                    label="Save"
                    loading={saving}
                    disabled={!loading && issuances.length === 0}
                    onClick={handleSave}
                />
            </div>
        </Modal>
    );
};

export default CreateReplenishmentForm;
