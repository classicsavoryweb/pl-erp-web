"use client";

import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import TextArea from "@/components/common/TextArea";
import {cancelPhysicalCount} from "@/api/uniform/physical-count";
import { useState } from "react";
import { toast } from "react-toastify";
import { useApiCall } from "@/hooks/api-call";

interface PhysicalCountProps {
    modal: any;
    title: string;
    selected: any; 
    responseMessage:any;
     onSubmitCallback?: () => void;

}

const PhysicalCountCancelForm = ({
    modal,
    title,
    selected,
    responseMessage,
    onSubmitCallback

} : PhysicalCountProps) => {
    const [cancelReason , setCancelReason] = useState("");
    
    const submitCancel = async () => {
            if (!cancelReason.trim() || !selected) {
                toast.error("Cancel reason is required.");
                return;
            }
    
            modal.setLoading(true);
            const resp = await cancelPhysicalCount(selected.id, cancelReason);
            modal.setLoading(false);
    
            if (resp?.error || resp?.errors) {
                toast.error(responseMessage(resp));
                return;
            }
    
            toast.success(`${title} cancelled`);
            modal.onClose();
            setCancelReason("");
            onSubmitCallback?.();
        };

    return (
        <>
            <Modal
                size="md"
                title={`Cancel ${title}`}
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

export default PhysicalCountCancelForm;