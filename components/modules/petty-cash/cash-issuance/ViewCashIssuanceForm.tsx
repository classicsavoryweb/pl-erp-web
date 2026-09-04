"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import TextArea from "@/components/common/TextArea";
import Button from "@/components/common/Button";

interface ViewCashIssuanceFormProps {
    modal: any;
    formValue: any;
    isVoidMode?: boolean;
    onVoid?: (reason: string) => void | Promise<void>;
}

const ViewCashIssuanceForm = ({ modal, formValue, isVoidMode = false, onVoid }: ViewCashIssuanceFormProps) => {
    const [voidReason, setVoidReason] = useState("");
    const [voidReasonError, setVoidReasonError] = useState("");
    const [voidLoading, setVoidLoading] = useState(false);

    useEffect(() => {
        if (modal.isShowing) {
            setVoidReason("");
            setVoidReasonError("");
        }
    }, [modal.isShowing]);

    const formatAmount = (value: any) =>
        value != null && value !== ""
            ? Number(value).toLocaleString("en-PH", { style: "currency", currency: "PHP" })
            : "—";

    const formatPCV = (pcvNumber: any, cshubTransNo: any) =>
        cshubTransNo ? `${pcvNumber} (${cshubTransNo})` : pcvNumber;

    const handleVoidClick = async () => {
        if (!voidReason.trim()) {
            setVoidReasonError("Reason for voiding is required.");
            return;
        }
        setVoidLoading(true);
        try {
            await onVoid?.(voidReason.trim());
        } finally {
            setVoidLoading(false);
        }
    };

    return (
        <Modal
            isShowing={modal.isShowing}
            title={isVoidMode ? "Void Cash Issuance" : "View Cash Issuance"}
            onClose={modal.onClose}
            size="md"
        >
            <div className="grid grid-cols-2 gap-x-4">
                <Textfield
                    label="PCV Number"
                    name="pcv_number"
                    value={formValue?.pcv_number ? formatPCV(formValue.pcv_number, formValue.cshub_trans_no) : ""}
                    disabled
                    onChange={() => {}}
                />
                <Textfield
                    label="Date"
                    name="date"
                    value={formValue?.date ?? ""}
                    disabled
                    onChange={() => {}}
                />
            </div>

            <Textfield
                label="Branch"
                name="branch_name"
                value={formValue?.branch_name ?? ""}
                disabled
                onChange={() => {}}
            />

            <Textfield
                label="Requested By"
                name="requested_by_name"
                value={formValue?.requested_by_name ?? ""}
                disabled
                onChange={() => {}}
            />

            <Textfield
                label="Received By"
                name="received_by_name"
                value={formValue?.received_by_name ?? ""}
                disabled
                onChange={() => {}}
            />

            <Textfield
                label="Approved By"
                name="approved_by_name"
                value={formValue?.approved_by_name ?? ""}
                disabled
                onChange={() => {}}
            />

            <div className="grid grid-cols-2 gap-x-4">
                <Textfield
                    label="Cash Issuance Amount"
                    name="amount"
                    value={formatAmount(formValue?.amount)}
                    disabled
                    onChange={() => {}}
                />
                <Textfield
                    label="Unliquidated Amount"
                    name="unliquidated_amount"
                    value={formatAmount(formValue?.unliquidated_amount)}
                    disabled
                    onChange={() => {}}
                />
            </div>

            <Textfield
                label="Detailed Purpose"
                name="detailed_purpose"
                value={formValue?.detailed_purpose ?? ""}
                disabled
                onChange={() => {}}
            />

            <Textfield
                label="Status"
                name="status"
                value={formValue?.status ?? ""}
                disabled
                onChange={() => {}}
            />

            {!isVoidMode && formValue?.status === "Voided" && (
                <TextArea
                    label="Void Reason"
                    name="void_reason_view"
                    value={formValue?.void_reason ?? ""}
                    disabled
                    onChange={() => {}}
                />
            )}

            {isVoidMode && (
                <TextArea
                    label="Reason for Voiding"
                    name="void_reason"
                    placeholder="enter reason for voiding this cash issuance"
                    value={voidReason}
                    required
                    error={voidReasonError}
                    onChange={(e) => {
                        setVoidReason(e.target.value);
                        if (voidReasonError) setVoidReasonError("");
                    }}
                />
            )}

            <hr className="mt-6 pb-2 text-slate-300" />
            <div className="flex justify-end gap-x-2">
                <Button label="Cancel" variant="secondary" onClick={modal.onClose} />
                {isVoidMode && (
                    <Button label="Void" loading={voidLoading} onClick={handleVoidClick} />
                )}
            </div>
        </Modal>
    );
};

export default ViewCashIssuanceForm;
