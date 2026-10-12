"use client";

import { useRef, useState } from "react";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import ActionDropDown from "@/components/common/ActionDropDown";
import confirm from "@/components/common/Confirm";
import { toast } from "react-toastify";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useModal } from "@/hooks/modal";
import { getReplenishment, postReplenishment } from "@/api/petty-cash/replenishment";
import { getCashIssuance } from "@/api/petty-cash/cash-issuance";
import ViewCashIssuanceForm from "../cash-issuance/ViewCashIssuanceForm";
import LiquidateModal from "../cash-issuance/LiquidateModal";

interface ViewReplenishmentModalProps {
    modal: any;
    replenishmentId: number | null;
    showPostAction?: boolean;
    onPosted?: () => void;
}

const formatPCV = (pcvNumber: any, cshubTransNo: any) =>
    cshubTransNo ? `${pcvNumber} (${cshubTransNo})` : pcvNumber;

const formatAmount = (value: any) =>
    value != null && value !== ""
        ? Number(value).toLocaleString("en-PH", { style: "currency", currency: "PHP" })
        : "—";

const renderOverUnder = (value: any) => {
    if (value == null || value === "") return <span className="text-gray-400">—</span>;
    const val = Number(value);
    const formatted = Math.abs(val).toLocaleString("en-PH", { style: "currency", currency: "PHP" });
    if (val === 0) return <span>{formatted}</span>;
    return val < 0
        ? <span className="text-green-600 dark:text-green-400">+{formatted}</span>
        : <span className="text-red-600 dark:text-red-400">-{formatted}</span>;
};

const ViewReplenishmentModal = ({ modal, replenishmentId, showPostAction = false, onPosted }: ViewReplenishmentModalProps) => {
    const [loading, setLoading] = useState(false);
    const [posting, setPosting] = useState(false);
    const [replenishment, setReplenishment] = useState<any>(null);
    const [selectedIssuance, setSelectedIssuance] = useState<any>(null);
    const viewIssuanceModal = useModal();
    const liquidateIssuanceModal = useModal();
    const isPostingRef = useRef(false);

    useAsyncEffect(() => {
        if (!modal.isShowing || !replenishmentId) return;
        setLoading(true);
        getReplenishment(replenishmentId)
            .then((resp) => {
                if (!resp.error) {
                    setReplenishment(resp.data);
                } else {
                    toast.error(resp.data?.message || "Error loading replenishment");
                }
            })
            .catch(() => toast.error("Error encountered"))
            .finally(() => setLoading(false));
    }, [modal.isShowing, replenishmentId]);

    const handleViewTransaction = (row: any) => {
        if (!row.petty_cash_issuance_id) {
            toast.error("Original cash issuance record not found.");
            return;
        }

        getCashIssuance(row.petty_cash_issuance_id)
            .then((resp) => {
                if (resp.error) {
                    toast.error(resp.data?.message || "Error loading cash issuance");
                    return;
                }

                const item = resp.data.issuance;
                const mapped = {
                    ...item,
                    branch_name: item.branch?.name ?? "—",
                    requested_by_name: item.requested_by ? `${item.requested_by.last_name}, ${item.requested_by.first_name}` : "—",
                    received_by_name: item.received_by ? `${item.received_by.last_name}, ${item.received_by.first_name}` : "—",
                    approved_by_name: item.approved_by ? `${item.approved_by.last_name}, ${item.approved_by.first_name}` : "—",
                };

                setSelectedIssuance(mapped);
                if (mapped.status === "Liquidated" || mapped.status === "Fully Liquidated") {
                    liquidateIssuanceModal.onOpen();
                } else {
                    viewIssuanceModal.onOpen();
                }
            })
            .catch(() => toast.error("Error encountered"));
    };

    const handlePost = async () => {
        if (isPostingRef.current || !replenishment) return;

        const isConfirmed = await confirm({
            title: "Post Replenishment",
            message: `Are you sure you want to post ${replenishment.replenishment_id}? This cannot be voided afterwards.`,
        });
        if (!isConfirmed) return;

        isPostingRef.current = true;
        setPosting(true);
        postReplenishment(replenishment.id)
            .then((resp) => {
                if (!resp.error) {
                    toast.success("Replenishment posted successfully.");
                    modal.onClose();
                    onPosted?.();
                } else {
                    toast.error(resp.data?.message || "Error posting replenishment");
                }
            })
            .catch(() => toast.error("Error encountered"))
            .finally(() => {
                setPosting(false);
                isPostingRef.current = false;
            });
    };

    const snapshots = replenishment?.snapshots ?? [];

    return (
        <>
            <Modal
                isShowing={modal.isShowing}
                title={`View Replenishment${replenishment?.replenishment_id ? ` — ${replenishment.replenishment_id}` : ""}`}
                onClose={modal.onClose}
                size="xxl"
            >
                <div className="flex flex-col gap-4 bg-gray-100 dark:bg-neutral-800 rounded p-3 mb-5 text-sm">
                    <div className="grid grid-cols-4 gap-4">
                        <div>
                            <p className="text-gray-500 dark:text-neutral-400 font-semibold text-xs mb-1">Replenishment ID</p>
                            <p className="font-medium">{replenishment?.replenishment_id ?? "—"}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-neutral-400 font-semibold text-xs mb-1">Transaction Date</p>
                            <p className="font-medium">{replenishment?.date ?? "—"}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-neutral-400 font-semibold text-xs mb-1">Status</p>
                            <p className="font-medium">{replenishment?.status ?? "—"}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        <div>
                            <p className="text-gray-500 dark:text-neutral-400 font-semibold text-xs mb-1">Total Cash Issuance Amount</p>
                            <p className="font-medium">{formatAmount(replenishment?.total_cash_issuance_amount)}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-neutral-400 font-semibold text-xs mb-1">Total Over/Under Amount</p>
                            <p className="font-medium">{renderOverUnder(replenishment?.total_overunder_amount)}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-neutral-400 font-semibold text-xs mb-1">Total Unliquidated Amount</p>
                            <p className="font-medium">{formatAmount(replenishment?.total_unliquidated_amount)}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-neutral-400 font-semibold text-xs mb-1">Total Replenishment</p>
                            <p className="font-medium">{formatAmount(replenishment?.total_replenishment_amount)}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-neutral-400 font-semibold text-xs mb-1">Branches</p>
                        <p className="font-medium">{replenishment?.branches_summary ?? "—"}</p>
                    </div>
                    {replenishment?.status === "Voided" && (
                        <div>
                            <p className="text-gray-500 dark:text-neutral-400 font-semibold text-xs mb-1">Void Reason</p>
                            <p className="font-medium">{replenishment?.void_reason ?? "—"}</p>
                        </div>
                    )}
                </div>

                <p className="font-semibold text-sm mb-2">Included Transactions</p>

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
                                <th className="text-left px-3 py-2 whitespace-nowrap">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={9} className="text-center py-6 text-gray-400">Loading...</td>
                                </tr>
                            ) : snapshots.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="text-center py-6 text-gray-400">No transactions found.</td>
                                </tr>
                            ) : (
                                snapshots.map((row: any) => (
                                    <tr key={row.id} className="border-t dark:border-neutral-600">
                                        <td className="px-3 py-2 whitespace-nowrap font-mono text-xs">{formatPCV(row.pcv_number, row.cshub_trans_no)}</td>
                                        <td className="px-3 py-2 whitespace-nowrap">{row.transaction_date}</td>
                                        <td className="px-3 py-2 whitespace-nowrap">{row.branch_name}</td>
                                        <td className="px-3 py-2 whitespace-nowrap">{row.requested_by_name}</td>
                                        <td className="px-3 py-2 text-right whitespace-nowrap">{formatAmount(row.amount)}</td>
                                        <td className="px-3 py-2 text-right whitespace-nowrap">{formatAmount(row.unliquidated_amount)}</td>
                                        <td className="px-3 py-2 text-right whitespace-nowrap">{renderOverUnder(row.overunder_amount)}</td>
                                        <td className="px-3 py-2 whitespace-nowrap">{row.status_at_snapshot}</td>
                                        <td className="px-3 py-2 relative">
                                            <ActionDropDown
                                                data={row}
                                                actions={[
                                                    { label: "View", onClick: () => handleViewTransaction(row) },
                                                ]}
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <hr className="mt-5 mb-3 border-slate-200 dark:border-neutral-700" />
                <div className="flex justify-end gap-x-2">
                    <Button label="Close" variant="secondary" onClick={modal.onClose} />
                    {showPostAction && replenishment?.status === "Pending" && (
                        <Button label="Post" loading={posting} onClick={handlePost} />
                    )}
                </div>
            </Modal>

            <ViewCashIssuanceForm
                modal={viewIssuanceModal}
                formValue={selectedIssuance}
            />
            <LiquidateModal
                modal={liquidateIssuanceModal}
                issuance={selectedIssuance}
                viewOnly
            />
        </>
    );
};

export default ViewReplenishmentModal;
