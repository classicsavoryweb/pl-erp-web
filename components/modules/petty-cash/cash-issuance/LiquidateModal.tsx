"use client";

import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import Dropdown from "@/components/common/Dropdown";
import SearchableDropDown from "@/components/common/SearchableDropDown";
import Button from "@/components/common/Button";
import ActionDropDown from "@/components/common/ActionDropDown";
import DropDownButtons from "@/components/common/DropDownButtons";
import PostLiquidationDenominationModal, { DenominationEntry } from "./PostLiquidationDenominationModal";
import ImportLiquidationFromCSHubModal from "./ImportLiquidationFromCSHubModal";
import { useModal } from "@/hooks/modal";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import confirm from "@/components/common/Confirm";
import { useEffect, useRef, useState } from "react";
import { useAsyncEffect } from "@/hooks/async-effect";
import moment from "moment";
import { getFileTypeFromBase64 } from "@/helper/file";
import {
    getLiquidations,
    getLiquidationAttachment,
    createLiquidation,
    editLiquidation,
    voidLiquidation,
    postLiquidation,
    getExpenseTypes,
} from "@/api/petty-cash/liquidation";

const LIQUIDATION_TYPES = [
    { label: "Cash Advance Liquidation", value: "Cash Advance Liquidation" },
];

interface LiquidateModalProps {
    modal: any;
    issuance: any;
    viewOnly?: boolean;
    onRefreshCustodian?: () => void;
    onPostSuccess?: () => void;
}

type Attachment = {
    id?: number;
    file?: File;
    file_name: string;
    isExisting: boolean;
    base64?: string;
};

type AttachmentViewerProps = {
    att: Attachment;
};

const AttachmentViewer = ({ att }: AttachmentViewerProps) => {
    const modal = useModal();
    const [src, setSrc] = useState("");
    const [loading, setLoading] = useState(false);

    const handleView = async () => {
        if (att.base64) {
            setSrc(att.base64);
            modal.onOpen();
        } else if (att.id) {
            setLoading(true);
            const resp = await getLiquidationAttachment(att.id);
            setLoading(false);
            if (!resp.error) {
                setSrc(resp.data.file_data);
                modal.onOpen();
            } else {
                toast.error("Failed to load file.");
            }
        }
    };

    return (
        <div className="flex">
            <button
                type="button"
                onClick={handleView}
                disabled={loading}
                className="text-xs text-blue-500 hover:underline disabled:opacity-50"
            >
                {loading ? "Loading..." : "View"}
            </button>
            <Modal
                isShowing={modal.isShowing}
                onClose={modal.onClose}
                title={att.file_name}
                size="xxl"
            >
                <div className="w-full h-[85vh] overflow-auto">
                    {getFileTypeFromBase64(src) === "image" ? (
                        <img src={src} className="object-fit" alt="preview" />
                    ) : (
                        <iframe
                            src={src}
                            className="origin-top-left"
                            style={{ width: "100%", height: "100%", transformOrigin: "top left" }}
                        />
                    )}
                </div>
            </Modal>
        </div>
    );
};

const today = moment().format("YYYY-MM-DD");

const formatAmount = (value: any) =>
    value != null && value !== ""
        ? Number(value).toLocaleString("en-PH", { style: "currency", currency: "PHP" })
        : "—";

const formatPCV = (pcvNumber: any, cshubTransNo: any) =>
    cshubTransNo ? `${pcvNumber} (${cshubTransNo})` : pcvNumber;

const LiquidateModal = ({ modal, issuance, viewOnly = false, onRefreshCustodian, onPostSuccess }: LiquidateModalProps) => {
    const [liquidations, setLiquidations] = useState<any[]>([]);
    const [nextLiqId, setNextLiqId] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [expenseTypes, setExpenseTypes] = useState<any[]>([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [reload, setReload] = useState(0);
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [removedIds, setRemovedIds] = useState<number[]>([]);
    const [changeAmount, setChangeAmount] = useState(0);
    const [postLoading, setPostLoading] = useState(false);
    const [formViewOnly, setFormViewOnly] = useState(false);
    const isSubmittingLiquidationRef = useRef(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const formModal = useModal();
    const denomModal = useModal();
    const importLiquidationModal = useModal();

    const triggerReload = () => setReload((n) => n + 1);

    const resetFormState = () => {
        setEditingId(null);
        setAttachments([]);
        setRemovedIds([]);
        setFormViewOnly(false);
    };

    const formHandler = useFormik({
        initialValues: {
            liquidation_type: "Cash Advance Liquidation",
            reference_document_number: "",
            reference_document_date: today,
            description: "",
            amount: "",
            supplier_vendor: "",
            expense_type_id: "",
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
                .min(0.01, "Amount must be greater than 0."),
            supplier_vendor: Yup.string()
                .required("Supplier/Vendor is required.")
                .max(150, "Max 150 characters."),
            expense_type_id: Yup.string().required("Expense type is required."),
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            if (isSubmittingLiquidationRef.current) return;
            isSubmittingLiquidationRef.current = true;

            try {
                const isEdit = editingId !== null;

                if (attachments.length === 0) {
                    toast.error("At least one attachment is required.");
                    return;
                }

                const isConfirmed = await confirm({
                    title: isEdit ? "Update Liquidation" : "Add Liquidation",
                    message: isEdit
                        ? "Are you sure you want to update this liquidation?"
                        : "Are you sure you want to add this liquidation?",
                });

                if (!isConfirmed) return;

                setSubmitting(true);

                const formData = new FormData();
                if (!isEdit) formData.append("petty_cash_issuance_id", String(issuance?.id));
                formData.append("liquidation_type", values.liquidation_type);
                formData.append("reference_document_number", values.reference_document_number);
                formData.append("reference_document_date", values.reference_document_date);
                formData.append("description", values.description);
                formData.append("amount", String(values.amount));
                formData.append("supplier_vendor", values.supplier_vendor);
                formData.append("expense_type_id", String(values.expense_type_id));

                const newFiles = attachments.filter((a) => !a.isExisting && a.file);
                newFiles.forEach((a, i) => {
                    formData.append(`attachments[${i}]`, a.file!);
                    formData.append(`attachment_names[${i}]`, a.file_name);
                });

                if (isEdit && removedIds.length > 0) {
                    removedIds.forEach((id, i) => formData.append(`removed_attachment_ids[${i}]`, String(id)));
                }

                const call = isEdit
                    ? editLiquidation(formData, editingId!)
                    : createLiquidation(formData);

                await call
                    .then((resp) => {
                        if (!resp.error) {
                            toast.success(isEdit ? "Liquidation updated." : "Liquidation added.");
                            triggerReload();
                            resetForm();
                            resetFormState();
                            formModal.onClose();
                        } else {
                            toast.error(resp.data?.message || "Error saving liquidation.");
                        }
                    })
                    .catch(() => toast.error("Error encountered."));
            } finally {
                setSubmitting(false);
                isSubmittingLiquidationRef.current = false;
            }
        },
    });

    useAsyncEffect(() => {
        if (!modal.isShowing || !issuance?.id) return;
        setTableLoading(true);
        getLiquidations(issuance.id)
            .then((resp) => {
                if (!resp.error) {
                    setLiquidations(resp.data.liquidations ?? []);
                    setNextLiqId(resp.data.next_liquidation_id ?? "");
                } else {
                    toast.error("Error loading liquidations.");
                }
            })
            .catch(() => toast.error("Error encountered."))
            .finally(() => setTableLoading(false));
    }, [modal.isShowing, issuance?.id, reload]);

    useAsyncEffect(() => {
        if (!modal.isShowing) return;
        getExpenseTypes()
            .then((resp) => {
                if (!resp.error) setExpenseTypes(resp.data.expense_types ?? []);
            })
            .catch(() => { });
    }, [modal.isShowing]);

    useEffect(() => {
        if (!modal.isShowing) {
            formHandler.resetForm();
            setLiquidations([]);
            resetFormState();
            denomModal.onClose();
        }
    }, [modal.isShowing]);

    const handleEdit = (row: any) => {
        setFormViewOnly(false);
        setEditingId(row.id);
        formHandler.setValues({
            liquidation_type: row.liquidation_type ?? "Cash Advance Liquidation",
            reference_document_number: row.reference_document_number ?? "",
            reference_document_date: row.reference_document_date ?? today,
            description: row.description ?? "",
            amount: row.amount ?? "",
            supplier_vendor: row.supplier_vendor ?? "",
            expense_type_id: String(row.expense_type_id ?? ""),
        });
        const existing: Attachment[] = (row.attachments ?? []).map((a: any) => ({
            id: a.id,
            file_name: a.file_name,
            isExisting: true,
        }));
        setAttachments(existing);
        setRemovedIds([]);
        formModal.onOpen();
    };

    const handleViewLiquidation = (row: any) => {
        setFormViewOnly(true);
        setEditingId(row.id);
        formHandler.setValues({
            liquidation_type: row.liquidation_type ?? "Cash Advance Liquidation",
            reference_document_number: row.reference_document_number ?? "",
            reference_document_date: row.reference_document_date ?? today,
            description: row.description ?? "",
            amount: row.amount ?? "",
            supplier_vendor: row.supplier_vendor ?? "",
            expense_type_id: String(row.expense_type_id ?? ""),
        });
        const existing: Attachment[] = (row.attachments ?? []).map((a: any) => ({
            id: a.id,
            file_name: a.file_name,
            isExisting: true,
        }));
        setAttachments(existing);
        setRemovedIds([]);
        formModal.onOpen();
    };

    const handleCancelForm = () => {
        formHandler.resetForm();
        resetFormState();
        formModal.onClose();
    };

    const handleVoid = async (row: any) => {
        const isConfirmed = await confirm({
            title: "Void Liquidation",
            message: "Are you sure you want to void this liquidation?",
        });

        if (!isConfirmed) return;

        voidLiquidation(row.id)
            .then((resp) => {
                if (!resp.error) {
                    toast.success("Liquidation voided.");
                    triggerReload();
                    if (editingId === row.id) {
                        formHandler.resetForm();
                        resetFormState();
                        formModal.onClose();
                    }
                } else {
                    toast.error(resp.data?.message || "Error voiding liquidation.");
                }
            })
            .catch(() => toast.error("Error encountered."));
    };

    const handlePostLiquidation = async () => {
        const totalLiquidated = liquidations.reduce((sum: number, l: any) => sum + Number(l.amount), 0);
        const change = Math.round((Number(issuance?.amount) - totalLiquidated) * 100) / 100;

        if (change > 0) {
            setChangeAmount(change);
            denomModal.onOpen();
            return;
        }

        const isConfirmed = await confirm({
            title: "Post Liquidation",
            message: "Are you sure you want to post this liquidation? This will mark the cash issuance as Liquidated.",
        });

        if (!isConfirmed) return;

        setTableLoading(true);
        postLiquidation(issuance?.id)
            .then((resp) => {
                if (!resp.error) {
                    toast.success("Cash issuance posted as liquidated.");
                    modal.onClose();
                    onRefreshCustodian?.();
                    onPostSuccess?.();
                } else {
                    toast.error(resp.data?.message || "Error posting liquidation.");
                }
            })
            .catch(() => toast.error("Error encountered."))
            .finally(() => setTableLoading(false));
    };

    const handleDenomConfirm = async (denominations: DenominationEntry[]) => {
        const isConfirmed = await confirm({
            title: "Post Liquidation",
            message: "Are you sure you want to post this liquidation? The change will be returned to the petty cash fund.",
        });

        if (!isConfirmed) return;

        setPostLoading(true);
        postLiquidation(issuance?.id, { denominations })
            .then((resp) => {
                if (!resp.error) {
                    toast.success("Cash issuance posted as liquidated.");
                    denomModal.onClose();
                    modal.onClose();
                    onRefreshCustodian?.();
                    onPostSuccess?.();
                } else {
                    toast.error(resp.data?.message || "Error posting liquidation.");
                }
            })
            .catch(() => toast.error("Error encountered."))
            .finally(() => setPostLoading(false));
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

    const expenseTypeOptions = expenseTypes.map((e: any) => ({
        label: e.description,
        value: String(e.id),
    }));

    const currentLiqId = editingId
        ? (liquidations.find((l) => l.id === editingId)?.liquidation_id ?? "")
        : nextLiqId;

    const totalLiquidatedAmount = liquidations.reduce((sum: number, l: any) => sum + Number(l.amount), 0);

    return (
        <>
            <Modal
                isShowing={modal.isShowing}
                title={viewOnly ? "View Cash Issuance Liquidation" : "Liquidate Cash Issuance"}
                onClose={() => {
                    modal.onClose();
                    formHandler.resetForm();
                    setEditingId(null);
                }}
                size="xxl"
            >
                <div className="grid grid-cols-4 gap-4 bg-gray-100 dark:bg-neutral-800 rounded p-3 mb-5 text-sm">
                    <div>
                        <p className="text-gray-500 dark:text-neutral-400 font-semibold text-xs mb-1">PCV Number</p>
                        <p className="font-medium">{issuance?.pcv_number ? formatPCV(issuance.pcv_number, issuance.cshub_trans_no) : "—"}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-neutral-400 font-semibold text-xs mb-1">Detailed Purpose</p>
                        <p className="font-medium">{issuance?.detailed_purpose ?? "—"}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-neutral-400 font-semibold text-xs mb-1">Cash Issuance Amount</p>
                        <p className="font-medium">{formatAmount(issuance?.amount)}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-neutral-400 font-semibold text-xs mb-1">Status</p>
                        <p className="font-medium">{issuance?.status ?? "—"}</p>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-sm">Liquidation Records</p>
                    {!viewOnly && (
                    <DropDownButtons
                        actions={[
                            ...(liquidations.length > 0
                                ? [{ label: "Post Liquidation", onClick: handlePostLiquidation, disabled: tableLoading }]
                                : []
                            ),
                            {
                                label: "Add Liquidation",
                                onClick: () => {
                                    formHandler.resetForm();
                                    resetFormState();
                                    formModal.onOpen();
                                },
                            },
                            ...(issuance?.cshub_trans_no
                                ? [{ label: "Import Liquidation from CSHUB", onClick: () => importLiquidationModal.onOpen() }]
                                : []
                            ),
                        ]}
                    />
                    )}
                </div>

                <div className="overflow-x-auto border dark:border-neutral-600 rounded min-h-[220px]">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 dark:bg-neutral-800">
                            <tr>
                                <th className="text-left px-3 py-2 whitespace-nowrap">Liquidation ID</th>
                                <th className="text-left px-3 py-2 whitespace-nowrap">Date</th>
                                <th className="text-left px-3 py-2 whitespace-nowrap">Type</th>
                                <th className="text-left px-3 py-2 whitespace-nowrap">Ref Doc No.</th>
                                <th className="text-left px-3 py-2 whitespace-nowrap">Ref Doc Date</th>
                                <th className="text-left px-3 py-2">Description</th>
                                <th className="text-right px-3 py-2 whitespace-nowrap">Amount</th>
                                <th className="text-left px-3 py-2 whitespace-nowrap">Expense Type</th>
                                <th className="text-left px-3 py-2 whitespace-nowrap">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableLoading ? (
                                <tr>
                                    <td colSpan={9} className="text-center py-6 text-gray-400">Loading...</td>
                                </tr>
                            ) : liquidations.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="text-center py-6 text-gray-400">No liquidation records yet.</td>
                                </tr>
                            ) : (
                                liquidations.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="border-t dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-800"
                                    >
                                        <td className="px-3 py-2 whitespace-nowrap font-mono text-xs">{row.liquidation_id}</td>
                                        <td className="px-3 py-2 whitespace-nowrap">{row.date}</td>
                                        <td className="px-3 py-2 whitespace-nowrap">{row.liquidation_type}</td>
                                        <td className="px-3 py-2 whitespace-nowrap">{row.reference_document_number}</td>
                                        <td className="px-3 py-2 whitespace-nowrap">{row.reference_document_date}</td>
                                        <td className="px-3 py-2 max-w-[180px] truncate" title={row.description}>{row.description}</td>
                                        <td className="px-3 py-2 text-right whitespace-nowrap">
                                            {Number(row.amount).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap">{row.expense_type?.description ?? "—"}</td>
                                        <td className="px-3 py-2">
                                            <ActionDropDown
                                                data={row}
                                                actions={[
                                                    { label: "View", onClick: handleViewLiquidation },
                                                    ...(!viewOnly
                                                        ? [
                                                            { label: "Edit", onClick: handleEdit },
                                                            { label: "Void", onClick: handleVoid },
                                                        ]
                                                        : []),
                                                ]}
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end mt-2">
                    <div className="text-sm font-semibold">
                        Total Liquidated Amount:{" "}
                        <span className="tabular-nums">
                            {totalLiquidatedAmount.toLocaleString("en-PH", { style: "currency", currency: "PHP" })}
                        </span>
                    </div>
                </div>
            </Modal>

            <PostLiquidationDenominationModal
                modal={denomModal}
                changeAmount={changeAmount}
                loading={postLoading}
                onConfirm={handleDenomConfirm}
                onCancel={denomModal.onClose}
            />

            <ImportLiquidationFromCSHubModal
                modal={importLiquidationModal}
                issuance={issuance}
                onImported={triggerReload}
            />

            <Modal
                isShowing={formModal.isShowing}
                title={formViewOnly ? "View Liquidation" : editingId ? "Edit Liquidation" : "Add Liquidation"}
                onClose={handleCancelForm}
                size="xxl"
            >
                <div className="flex gap-x-6">
                    <div className="flex-1 min-w-0">
                        <form onSubmit={formHandler.handleSubmit}>
                            <div className="grid grid-cols-2 gap-x-4">
                                <div className="grid grid-cols-2 gap-x-4">
                                    <Textfield
                                        label="Liquidation ID"
                                        name="liquidation_id"
                                        value={currentLiqId}
                                        disabled
                                        onChange={() => { }}
                                    />
                                    <Textfield
                                        label="Cash Issuance Amount"
                                        name="cash_issuance_amount"
                                        value={formatAmount(issuance?.amount)}
                                        disabled
                                        onChange={() => { }}
                                    />
                                </div>
                                <Textfield
                                    label="Requested By"
                                    name="requested_by"
                                    value={issuance?.requested_by_name ?? ""}
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
                                    label="Amount"
                                    placeholder="enter amount"
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
                        <Button label="Close" variant="secondary" type="button" onClick={handleCancelForm} />
                    ) : (
                        <>
                            <Button label="Cancel" variant="secondary" type="button" onClick={handleCancelForm} />
                            <Button
                                type="button"
                                label={editingId ? "Update Liquidation" : "Add Liquidation"}
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

export default LiquidateModal;
