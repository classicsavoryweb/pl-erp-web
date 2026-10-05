"use client";

import { useContext, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { AuthContext } from "@/context/AuthProvider";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import Grid from "@/components/common/Grid";
import Textfield from "@/components/common/Textfield";
import TextArea from "@/components/common/TextArea";
import Dropdown from "@/components/common/Dropdown";
import SearchableDropDown from "@/components/common/SearchableDropDown";
import DropDownButtons from "@/components/common/DropDownButtons";
import confirm from "@/components/common/Confirm";
import { toast } from "react-toastify";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useModal } from "@/hooks/modal";
import { getReplenishment } from "@/api/petty-cash/replenishment";
import { reviewReplenishmentAudit, postReplenishmentAudit } from "@/api/petty-cash/audit";
import {
    getLiquidationsForReplenishment,
    getExpenseTypes,
    auditCreateLiquidation,
    auditEditLiquidation,
} from "@/api/petty-cash/liquidation";
import { AttachmentViewer, Attachment } from "../cash-issuance/LiquidateModal";

const LIQUIDATION_TYPES = [
    { label: "Cash Advance Liquidation", value: "Cash Advance Liquidation" },
];

interface AuditReviewModalProps {
    modal: any;
    replenishmentId: number | null;
    viewOnly?: boolean;
    onActionSuccess?: () => void;
}

const today = moment().format("YYYY-MM-DD");

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

const formatPCV = (pcvNumber: any, cshubTransNo: any) =>
    cshubTransNo ? `${pcvNumber} (${cshubTransNo})` : pcvNumber;

const AuditReviewModal = ({ modal, replenishmentId, viewOnly = false, onActionSuccess }: AuditReviewModalProps) => {
    const { permissions } = useContext(AuthContext);
    const canPerformAudit = permissions.includes("perform_pettycash_audit_module");
    const [loading, setLoading] = useState(false);
    const [replenishment, setReplenishment] = useState<any>(null);
    const [liquidations, setLiquidations] = useState<any[]>([]);
    const [unliquidatedIssuances, setUnliquidatedIssuances] = useState<any[]>([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [expenseTypes, setExpenseTypes] = useState<any[]>([]);
    const [auditActionLoading, setAuditActionLoading] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formViewOnly, setFormViewOnly] = useState(false);
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [removedIds, setRemovedIds] = useState<number[]>([]);
    const [latestAuditLog, setLatestAuditLog] = useState<any>(null);
    const isAuditActionRef = useRef(false);
    const isSubmittingRef = useRef(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const formModal = useModal();

    const fetchReplenishment = () => {
        if (!replenishmentId) return;
        setLoading(true);
        getReplenishment(replenishmentId)
            .then((resp) => {
                if (!resp.error) setReplenishment(resp.data);
                else toast.error(resp.data?.message || "Error loading replenishment");
            })
            .catch(() => toast.error("Error encountered"))
            .finally(() => setLoading(false));
    };

    const fetchLiquidations = () => {
        if (!replenishmentId) return;
        setTableLoading(true);
        getLiquidationsForReplenishment(replenishmentId)
            .then((resp) => {
                if (!resp.error) {
                    setLiquidations(resp.data?.liquidations ?? []);
                    setUnliquidatedIssuances(resp.data?.unliquidated_issuances ?? []);
                } else {
                    toast.error(resp.data?.message || "Error loading liquidations");
                }
            })
            .catch(() => toast.error("Error encountered"))
            .finally(() => setTableLoading(false));
    };

    useAsyncEffect(() => {
        if (!modal.isShowing || !replenishmentId) return;
        fetchReplenishment();
        fetchLiquidations();
    }, [modal.isShowing, replenishmentId]);

    useAsyncEffect(() => {
        if (!modal.isShowing) return;
        getExpenseTypes()
            .then((resp) => {
                if (!resp.error) setExpenseTypes(resp.data.expense_types ?? []);
            })
            .catch(() => { });
    }, [modal.isShowing]);

    const resetFormState = () => {
        setEditingId(null);
        setFormViewOnly(false);
        setAttachments([]);
        setRemovedIds([]);
        setLatestAuditLog(null);
    };

    const formHandler = useFormik({
        initialValues: {
            petty_cash_issuance_id: "",
            liquidation_type: "Cash Advance Liquidation",
            reference_document_number: "",
            reference_document_date: today,
            description: "",
            amount: "",
            supplier_vendor: "",
            expense_type_id: "",
            reason: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            liquidation_type: Yup.string().required("Liquidation type is required."),
            reference_document_number: Yup.string()
                .required("Reference document number is required.")
                .max(50, "Max 50 characters."),
            reference_document_date: Yup.date()
                .required("Reference document date is required.")
                .max(new Date(), "Cannot select a future date."),
            description: Yup.string()
                .required("Description is required.")
                .max(250, "Max 250 characters."),
            amount: Yup.number()
                .typeError("Amount must be a number.")
                .required("Amount is required.")
                .min(0, "Amount cannot be negative."),
            supplier_vendor: Yup.string()
                .required("Supplier/Vendor is required.")
                .max(150, "Max 150 characters."),
            expense_type_id: Yup.string().required("Expense type is required."),
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            if (isSubmittingRef.current) return;
            isSubmittingRef.current = true;

            try {
                const isEdit = editingId !== null;

                if (attachments.length === 0) {
                    toast.error("At least one attachment is required.");
                    return;
                }

                if (!isEdit && !values.petty_cash_issuance_id) {
                    toast.error("Please select a cash issuance to attach this liquidation to.");
                    return;
                }

                if (!values.reason.trim()) {
                    toast.error("Reason is required.");
                    return;
                }

                const isConfirmed = await confirm({
                    title: isEdit ? "Update Liquidation" : "Add Liquidation",
                    message: isEdit
                        ? "Are you sure you want to update this liquidation? This will overwrite the existing record."
                        : "Are you sure you want to add this liquidation?",
                });

                if (!isConfirmed) return;

                setSubmitting(true);

                const formData = new FormData();
                if (!isEdit) formData.append("petty_cash_issuance_id", String(values.petty_cash_issuance_id));
                formData.append("petty_cash_replenishment_id", String(replenishmentId));
                formData.append("liquidation_type", values.liquidation_type);
                formData.append("reference_document_number", values.reference_document_number);
                formData.append("reference_document_date", values.reference_document_date);
                formData.append("description", values.description);
                formData.append("amount", String(values.amount));
                formData.append("supplier_vendor", values.supplier_vendor);
                formData.append("expense_type_id", String(values.expense_type_id));
                formData.append("reason", values.reason);

                const newFiles = attachments.filter((a) => !a.isExisting && a.file);
                newFiles.forEach((a, i) => {
                    formData.append(`attachments[${i}]`, a.file!);
                    formData.append(`attachment_names[${i}]`, a.file_name);
                });

                if (isEdit && removedIds.length > 0) {
                    removedIds.forEach((id, i) => formData.append(`removed_attachment_ids[${i}]`, String(id)));
                }

                const call = isEdit
                    ? auditEditLiquidation(formData, editingId!)
                    : auditCreateLiquidation(formData);

                await call
                    .then((resp) => {
                        if (!resp.error) {
                            toast.success(isEdit ? "Liquidation updated." : "Liquidation added.");
                            resetForm();
                            resetFormState();
                            formModal.onClose();
                            fetchReplenishment();
                            fetchLiquidations();
                        } else {
                            toast.error(resp.data?.message || "Error saving liquidation.");
                        }
                    })
                    .catch(() => toast.error("Error encountered."));
            } finally {
                setSubmitting(false);
                isSubmittingRef.current = false;
            }
        },
    });

    const handleOpenAdd = () => {
        formHandler.resetForm();
        resetFormState();
        formModal.onOpen();
    };

    const handleView = (row: any) => {
        setFormViewOnly(true);
        setEditingId(row.id);
        formHandler.setValues({
            petty_cash_issuance_id: String(row.petty_cash_issuance_id ?? ""),
            liquidation_type: row.liquidation_type ?? "Cash Advance Liquidation",
            reference_document_number: row.reference_document_number ?? "",
            reference_document_date: row.reference_document_date ?? today,
            description: row.description ?? "",
            amount: row.amount ?? "",
            supplier_vendor: row.supplier_vendor ?? "",
            expense_type_id: String(row.expense_type_id ?? ""),
            reason: "",
        });
        const existing: Attachment[] = (row.attachments ?? []).map((a: any) => ({
            id: a.id,
            file_name: a.file_name,
            isExisting: true,
        }));
        setAttachments(existing);
        setRemovedIds([]);
        setLatestAuditLog(row.latest_audit_log ?? null);
        formModal.onOpen();
    };

    const handleCancelForm = () => {
        formHandler.resetForm();
        resetFormState();
        formModal.onClose();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const isAllowed = file.type.startsWith("image/") || file.type === "application/pdf";
        if (!isAllowed) {
            toast.error("Only image files and PDFs are allowed.");
            e.target.value = "";
            return;
        }

        const reader = new FileReader();
        reader.onload = (ev) => {
            const base64 = ev.target?.result as string;
            setAttachments((prev) => [...prev, { file, file_name: file.name, isExisting: false, base64 }]);
        };
        reader.readAsDataURL(file);
        e.target.value = "";
    };

    const handleRemoveAttachment = (index: number) => {
        const att = attachments[index];
        if (att.isExisting && att.id) {
            setRemovedIds((prev) => [...prev, att.id!]);
        }
        setAttachments((prev) => prev.filter((_, i) => i !== index));
    };

    const handleMarkReviewed = async () => {
        if (isAuditActionRef.current || !replenishment) return;

        const isConfirmed = await confirm({
            title: "Mark as Reviewed",
            message: `Are you sure you want to mark ${replenishment.replenishment_id} as Reviewed?`,
        });
        if (!isConfirmed) return;

        isAuditActionRef.current = true;
        setAuditActionLoading(true);
        reviewReplenishmentAudit(replenishment.id)
            .then((resp) => {
                if (!resp.error) {
                    toast.success("Replenishment marked as Reviewed.");
                    modal.onClose();
                    onActionSuccess?.();
                } else {
                    toast.error(resp.data?.message || "Error marking replenishment as Reviewed");
                }
            })
            .catch(() => toast.error("Error encountered"))
            .finally(() => {
                setAuditActionLoading(false);
                isAuditActionRef.current = false;
            });
    };

    const handleMarkAudited = async () => {
        if (isAuditActionRef.current || !replenishment) return;

        const isConfirmed = await confirm({
            title: "Mark as Audited",
            message: `Are you sure you want to mark ${replenishment.replenishment_id} as Audited? This will make it available for Department Fund settlement.`,
        });
        if (!isConfirmed) return;

        isAuditActionRef.current = true;
        setAuditActionLoading(true);
        postReplenishmentAudit(replenishment.id)
            .then((resp) => {
                if (!resp.error) {
                    toast.success("Replenishment marked as Audited.");
                    modal.onClose();
                    onActionSuccess?.();
                } else {
                    toast.error(resp.data?.message || "Error marking replenishment as Audited");
                }
            })
            .catch(() => toast.error("Error encountered"))
            .finally(() => {
                setAuditActionLoading(false);
                isAuditActionRef.current = false;
            });
    };

    // Liquidated-at-snapshot lang, kapareho ng scope rule sa backend
    const issuanceOptions = (replenishment?.snapshots ?? [])
        .filter((s: any) => s.status_at_snapshot === 'Liquidated')
        .map((s: any) => ({
            label: formatPCV(s.pcv_number, s.cshub_trans_no),
            value: String(s.petty_cash_issuance_id),
        }));

    const selectedSnapshot = (replenishment?.snapshots ?? []).find(
        (s: any) => String(s.petty_cash_issuance_id) === String(formHandler.values.petty_cash_issuance_id)
    );

    const expenseTypeOptions = expenseTypes.map((e: any) => ({
        label: e.description,
        value: String(e.id),
    }));

    const isEdit = editingId !== null;
    // editing lang allowed sa Review step, Post step ay final look na lang
    const canEdit = canPerformAudit && !viewOnly && replenishment?.status === "Posted";

    return (
        <>
            <Modal
                isShowing={modal.isShowing}
                title={`${viewOnly ? "View" : replenishment?.status === "Reviewed" ? "Post" : "Review"} Replenishment${replenishment?.replenishment_id ? ` — ${replenishment.replenishment_id}` : ""}`}
                onClose={modal.onClose}
                size="entireScreen"
            >
                <div className="grid grid-cols-3 gap-4 bg-gray-100 dark:bg-neutral-800 rounded p-3 mb-5 text-sm">
                    <div>
                        <p className="text-gray-500 dark:text-neutral-400 font-semibold text-xs mb-1">Replenishment ID</p>
                        <p className="font-medium">{replenishment?.replenishment_id ?? "—"}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-neutral-400 font-semibold text-xs mb-1">Status</p>
                        <p className="font-medium">{replenishment?.status ?? "—"}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-neutral-400 font-semibold text-xs mb-1">Branches</p>
                        <p className="font-medium">{replenishment?.branches_summary ?? "—"}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-neutral-400 font-semibold text-xs mb-1">Total Cash Issuance Amount</p>
                        <p className="font-medium">{formatAmount(replenishment?.total_cash_issuance_amount)}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-neutral-400 font-semibold text-xs mb-1">Total Over/Under Amount</p>
                        <p className="font-medium">{renderOverUnder(replenishment?.total_overunder_amount)}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-neutral-400 font-semibold text-xs mb-1">Total Replenishment</p>
                        <p className="font-medium">{formatAmount(replenishment?.total_replenishment_amount)}</p>
                    </div>
                </div>

                <Grid cols={12}>
                    <div className="col-span-8 flex items-center">
                        <p className="font-semibold text-sm">Liquidations</p>
                    </div>
                    <div className="col-span-4 flex justify-end">
                        {canEdit && (
                            <DropDownButtons actions={[{ label: "Add Liquidation", onClick: handleOpenAdd }]} />
                        )}
                    </div>
                </Grid>
                <div className="mb-2" />

                <div className="overflow-x-auto border dark:border-neutral-600 rounded min-h-[220px]">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 dark:bg-neutral-800">
                            <tr>
                                <th className="text-left px-3 py-2 whitespace-nowrap">Liquidation ID</th>
                                <th className="text-left px-3 py-2 whitespace-nowrap">Transaction Date</th>
                                <th className="text-left px-3 py-2 whitespace-nowrap">Requested By</th>
                                <th className="text-left px-3 py-2 whitespace-nowrap">Received By</th>
                                <th className="text-left px-3 py-2 whitespace-nowrap">Approved By</th>
                                <th className="text-right px-3 py-2 whitespace-nowrap">Cash Issuance Amount</th>
                                <th className="text-right px-3 py-2 whitespace-nowrap">Over/Under Amount</th>
                                <th className="text-left px-3 py-2 whitespace-nowrap">Source</th>
                                <th className="text-left px-3 py-2 whitespace-nowrap">Liquidation Date</th>
                                <th className="text-left px-3 py-2 whitespace-nowrap">Ref Doc No.</th>
                                <th className="text-left px-3 py-2">Description</th>
                                <th className="text-right px-3 py-2 whitespace-nowrap">Liquidated Amount</th>
                                <th className="text-left px-3 py-2 whitespace-nowrap">Expense Type</th>
                                <th className="text-left px-3 py-2 whitespace-nowrap">Current Status</th>
                                <th className="text-left px-3 py-2 whitespace-nowrap sticky right-0 z-20 bg-gray-100 dark:bg-neutral-800">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(loading || tableLoading) ? (
                                <tr>
                                    <td colSpan={15} className="text-center py-6 text-gray-400">Loading...</td>
                                </tr>
                            ) : liquidations.length === 0 && unliquidatedIssuances.length === 0 ? (
                                <tr>
                                    <td colSpan={15} className="text-center py-6 text-gray-400">No liquidation records found.</td>
                                </tr>
                            ) : (
                                <>
                                {liquidations.map((row: any) => {
                                    const issuance = row.issuance ?? {};
                                    const employeeName = (emp: any) => emp ? `${emp.last_name}, ${emp.first_name}` : "—";
                                    return (
                                        <tr key={row.id} className="border-t dark:border-neutral-600">
                                            <td className="px-3 py-2 whitespace-nowrap font-mono text-xs">{row.liquidation_id}</td>
                                            <td className="px-3 py-2 whitespace-nowrap">{issuance.date ?? "—"}</td>
                                            <td className="px-3 py-2 whitespace-nowrap">{employeeName(issuance.requested_by)}</td>
                                            <td className="px-3 py-2 whitespace-nowrap">{employeeName(issuance.received_by)}</td>
                                            <td className="px-3 py-2 whitespace-nowrap">{employeeName(issuance.approved_by)}</td>
                                            <td className="px-3 py-2 text-right whitespace-nowrap">{formatAmount(issuance.amount)}</td>
                                            <td className="px-3 py-2 text-right whitespace-nowrap">{renderOverUnder(issuance.overunder_amount)}</td>
                                            <td className="px-3 py-2 whitespace-nowrap">{issuance.source ?? "—"}</td>
                                            <td className="px-3 py-2 whitespace-nowrap">{row.date}</td>
                                            <td className="px-3 py-2 whitespace-nowrap">{row.reference_document_number}</td>
                                            <td className="px-3 py-2 max-w-[220px] truncate" title={row.description}>{row.description}</td>
                                            <td className="px-3 py-2 text-right whitespace-nowrap">
                                                {Number(row.amount).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-3 py-2 whitespace-nowrap">{row.expense_type?.description ?? "—"}</td>
                                            <td className="px-3 py-2 whitespace-nowrap">{issuance.status ?? "—"}</td>
                                            <td className="px-3 py-2 whitespace-nowrap sticky right-0 z-20 bg-zinc-50 dark:bg-neutral-700">
                                                <button
                                                    type="button"
                                                    onClick={() => handleView(row)}
                                                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {unliquidatedIssuances.map((row: any) => {
                                    const issuance = row.issuance ?? {};
                                    const employeeName = (emp: any) => emp ? `${emp.last_name}, ${emp.first_name}` : "—";
                                    return (
                                        <tr key={`unliquidated-${row.petty_cash_issuance_id}`} className="border-t dark:border-neutral-600 text-gray-400">
                                            <td className="px-3 py-2 whitespace-nowrap">—</td>
                                            <td className="px-3 py-2 whitespace-nowrap">{issuance.date ?? "—"}</td>
                                            <td className="px-3 py-2 whitespace-nowrap">{employeeName(issuance.requested_by)}</td>
                                            <td className="px-3 py-2 whitespace-nowrap">{employeeName(issuance.received_by)}</td>
                                            <td className="px-3 py-2 whitespace-nowrap">{employeeName(issuance.approved_by)}</td>
                                            <td className="px-3 py-2 text-right whitespace-nowrap">{formatAmount(issuance.amount)}</td>
                                            <td className="px-3 py-2 text-right whitespace-nowrap">—</td>
                                            <td className="px-3 py-2 whitespace-nowrap">{issuance.source ?? "—"}</td>
                                            <td className="px-3 py-2 whitespace-nowrap">—</td>
                                            <td className="px-3 py-2 whitespace-nowrap">—</td>
                                            <td className="px-3 py-2">—</td>
                                            <td className="px-3 py-2 text-right whitespace-nowrap">—</td>
                                            <td className="px-3 py-2 whitespace-nowrap">—</td>
                                            <td className="px-3 py-2 whitespace-nowrap">{row.current_status ?? "—"}</td>
                                            <td className="px-3 py-2 whitespace-nowrap sticky right-0 z-20 bg-zinc-50 dark:bg-neutral-700"></td>
                                        </tr>
                                    );
                                })}
                                </>
                            )}
                        </tbody>
                    </table>
                </div>

                <hr className="mt-5 mb-3 border-slate-200 dark:border-neutral-700" />
                <div className="flex justify-end gap-x-2">
                    <Button label="Close" variant="secondary" onClick={modal.onClose} />
                    {canPerformAudit && !viewOnly && replenishment?.status === "Posted" && (
                        <Button label="Mark as Reviewed" loading={auditActionLoading} onClick={handleMarkReviewed} />
                    )}
                    {canPerformAudit && !viewOnly && replenishment?.status === "Reviewed" && (
                        <Button label="Mark as Audited" loading={auditActionLoading} onClick={handleMarkAudited} />
                    )}
                </div>
            </Modal>

            <Modal
                isShowing={formModal.isShowing}
                title={formViewOnly ? "View Liquidation" : isEdit ? "Edit Liquidation" : "Add Liquidation"}
                onClose={handleCancelForm}
                size="xxl"
            >
                {latestAuditLog && (
                    <div className="mb-4 rounded border border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700 px-3 py-2 text-xs">
                        <p className="font-semibold text-amber-700 dark:text-amber-400">
                            {latestAuditLog.action === "created" ? "Added by Audit" : "Edited by Audit"}
                            {latestAuditLog.performed_by?.full_name ? ` — ${latestAuditLog.performed_by.full_name}` : ""}
                            {latestAuditLog.created_at ? ` (${moment(latestAuditLog.created_at).format("MMM DD, YYYY hh:mm A")})` : ""}
                        </p>
                        <p className="text-amber-700 dark:text-amber-400 mt-1">Reason: {latestAuditLog.reason}</p>
                    </div>
                )}

                <div className="flex gap-x-6">
                    <div className="flex-1 min-w-0">
                        <form onSubmit={formHandler.handleSubmit}>
                            <div className="grid grid-cols-2 gap-x-4">
                                {isEdit ? (
                                    <Textfield
                                        label="PCV Number"
                                        name="pcv_number_display"
                                        value={issuanceOptions.find((o: any) => o.value === formHandler.values.petty_cash_issuance_id)?.label ?? ""}
                                        disabled
                                        onChange={() => { }}
                                    />
                                ) : (
                                    <Dropdown
                                        label="Cash Issuance (PCV Number)"
                                        placeholder="select cash issuance"
                                        name="petty_cash_issuance_id"
                                        value={formHandler.values.petty_cash_issuance_id}
                                        onChange={formHandler.handleChange}
                                        required
                                        options={issuanceOptions}
                                    />
                                )}
                                <Textfield
                                    label="Cash Issuance Amount"
                                    name="cash_issuance_amount_display"
                                    value={selectedSnapshot ? formatAmount(selectedSnapshot.amount) : "—"}
                                    disabled
                                    onChange={() => { }}
                                />
                                <Dropdown
                                    label="Liquidation Type"
                                    placeholder="select type"
                                    name="liquidation_type"
                                    value={formHandler.values.liquidation_type}
                                    onChange={formHandler.handleChange}
                                    required
                                    disabled={formViewOnly}
                                    error={formHandler.errors.liquidation_type}
                                    options={LIQUIDATION_TYPES}
                                />
                                <Textfield
                                    label="Reference Document Number"
                                    placeholder="enter ref doc number"
                                    name="reference_document_number"
                                    value={formHandler.values.reference_document_number}
                                    onChange={formHandler.handleChange}
                                    required
                                    disabled={formViewOnly}
                                    error={formHandler.errors.reference_document_number}
                                />
                                <Textfield
                                    label="Reference Document Date"
                                    name="reference_document_date"
                                    type="date"
                                    value={formHandler.values.reference_document_date}
                                    onChange={formHandler.handleChange}
                                    required
                                    disabled={formViewOnly}
                                    error={formHandler.errors.reference_document_date}
                                />
                                <SearchableDropDown
                                    label="Expense Type"
                                    placeholder="select expense type"
                                    name="expense_type_id"
                                    value={formHandler.values.expense_type_id}
                                    onChange={(e: any) => formHandler.setFieldValue("expense_type_id", e.target.value)}
                                    required
                                    disabled={formViewOnly}
                                    error={formHandler.errors.expense_type_id}
                                    options={expenseTypeOptions}
                                />
                                <Textfield
                                    label="Supplier/Vendor"
                                    placeholder="enter supplier/vendor"
                                    name="supplier_vendor"
                                    value={formHandler.values.supplier_vendor}
                                    onChange={formHandler.handleChange}
                                    required
                                    disabled={formViewOnly}
                                    isUpperCase
                                    error={formHandler.errors.supplier_vendor}
                                />
                                <Textfield
                                    label="Liquidation Amount"
                                    placeholder="enter liquidation amount"
                                    name="amount"
                                    type="number"
                                    value={formHandler.values.amount}
                                    onChange={formHandler.handleChange}
                                    required
                                    disabled={formViewOnly}
                                    error={formHandler.errors.amount}
                                />
                                <div className="col-span-2 py-1">
                                    <p className="mb-[-2px]">
                                        Description<span className="text-red-400">*</span>
                                    </p>
                                    <textarea
                                        name="description"
                                        placeholder="enter description"
                                        value={formHandler.values.description}
                                        onChange={formHandler.handleChange}
                                        maxLength={250}
                                        rows={3}
                                        disabled={formViewOnly}
                                        className={`w-full rounded-md focus:outline-none border-2 ${formHandler.errors.description
                                            ? "border-red-400"
                                            : "border-slate-300 focus:border-slate-400"
                                            } p-2 resize-none dark:bg-neutral-800 dark:border-neutral-700 ${formViewOnly ? "bg-gray-100 dark:bg-neutral-800 hover:cursor-not-allowed" : ""}`}
                                    />
                                    {formHandler.errors.description && (
                                        <p className="text-red-400 text-sm">{formHandler.errors.description}</p>
                                    )}
                                    <p className="text-xs text-gray-400 text-right">
                                        {formHandler.values.description.length}/250
                                    </p>
                                </div>
                                {!formViewOnly && (
                                    <div className="col-span-2">
                                        <TextArea
                                            label="Reason for Change"
                                            placeholder="enter reason for adding/changing this liquidation"
                                            name="reason"
                                            required
                                            value={formHandler.values.reason}
                                            onChange={formHandler.handleChange}
                                        />
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>

                    <div className="w-px bg-gray-200 dark:bg-neutral-700 shrink-0" />

                    <div className="w-[380px] shrink-0 flex flex-col">
                        <div className="flex items-center justify-between mb-3">
                            {!formViewOnly && (
                                <>
                                    <Button
                                        label="Attach File"
                                        variant="secondary"
                                        onClick={() => fileInputRef.current?.click()}
                                    />
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        className="hidden"
                                        accept="image/*,application/pdf"
                                        onChange={handleFileChange}
                                    />
                                </>
                            )}
                        </div>

                        <div className="flex flex-col gap-y-2">
                            {attachments.length === 0 ? (
                                <p className="text-xs text-gray-400 text-center py-4 border border-dashed dark:border-neutral-600 rounded">
                                    No files attached
                                </p>
                            ) : (
                                attachments.map((att, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between border dark:border-neutral-600 rounded px-3 py-2 text-sm"
                                    >
                                        <span className="truncate flex-1 mr-2 text-xs" title={att.file_name}>
                                            {att.file_name}
                                            {att.isExisting && (
                                                <span className="ml-1 text-xs text-gray-400">(saved)</span>
                                            )}
                                        </span>
                                        <div className="flex gap-x-1 shrink-0 items-center">
                                            <AttachmentViewer att={att} />
                                            {!formViewOnly && (
                                                <>
                                                    <span className="text-gray-300 dark:text-neutral-600">|</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveAttachment(i)}
                                                        className="text-xs text-red-400 hover:underline"
                                                    >
                                                        Remove
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <hr className="mt-5 mb-3 border-slate-200 dark:border-neutral-700" />
                <div className="flex justify-end gap-x-2">
                    {formViewOnly ? (
                        <>
                            <Button label="Close" variant="secondary" type="button" onClick={handleCancelForm} />
                            {canEdit && <Button label="Edit" type="button" onClick={() => setFormViewOnly(false)} />}
                        </>
                    ) : (
                        <>
                            <Button label="Cancel" variant="secondary" type="button" onClick={handleCancelForm} />
                            <Button
                                type="button"
                                label={isEdit ? "Save" : "Add Liquidation"}
                                loading={formHandler.isSubmitting}
                                onClick={() => formHandler.submitForm()}
                            />
                        </>
                    )}
                </div>
            </Modal>
        </>
    );
};

export default AuditReviewModal;
