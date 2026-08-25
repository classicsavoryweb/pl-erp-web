"use client";

import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import TextArea from "@/components/common/TextArea";
import {cancelWeightAverage} from "@/api/uniform/weighted-average";
import { useState } from "react";
import { toast } from "react-toastify";
import { useApiCall } from "@/hooks/api-call";

interface WeightedAverageCancelFormProps {
    modal: any;
    selected: any;
    onSubmitCallback?: () => void;
}

const VarianceReportCancelForm = ({
    modal,
    selected,
    onSubmitCallback,

   
} : WeightedAverageCancelFormProps) => {
    const [cancelReason , setCancelReason] = useState("");
    
    const submitCancel = async () => {
            if (!cancelReason.trim() || !selected) {
                toast.error("Cancel reason is required.");
                return;
            }
    
            modal.setLoading(true);
            const resp = await cancelWeightAverage(selected.id, {cancel_reason:cancelReason});
            modal.setLoading(false);
    
            if (resp?.error || resp?.errors) {
                toast.error(resp?.message || "Failed to cancel weighted average.");
                return;
            }
    
            toast.success(`Weighted Average cancelled`);
            modal.onClose();
            setCancelReason("");
            onSubmitCallback?.();
        };

    return (
        <>
            <Modal
                size="md"
                title={`Cancel Weighted Average`}
                isShowing={modal.isShowing}
                loading={modal.loading}
                onClose={modal.onClose}
            >
                <TextArea label="Cancel Reason" placeholder="Enter cancel reason" value={cancelReason} onChange={(e: any) => setCancelReason(e.target.value)} required />
                <div className="flex justify-end gap-x-2 mt-3">
                    <div className="w-[120px]">
                        <Button label="Cancel" variant="secondary" onClick={modal.onClose} />
                    </div>
                    <div className="w-[120px]">
                        <Button label="Submit" onClick={submitCancel} />
                    </div>
                </div>
            </Modal>
        </>
    )
    
}

export default VarianceReportCancelForm;