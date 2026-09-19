"use client";

import { useRef, useState } from "react";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import TextArea from "@/components/common/TextArea";
import confirm from "@/components/common/Confirm";
import { toast } from "react-toastify";
import { voidReplenishment } from "@/api/petty-cash/replenishment";

interface VoidReplenishmentModalProps {
    modal: any;
    replenishment: any;
    onSuccess: () => void;
}

const VoidReplenishmentModal = ({ modal, replenishment, onSuccess }: VoidReplenishmentModalProps) => {
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");
    const [voiding, setVoiding] = useState(false);
    const isSubmittingRef = useRef(false);

    const handleClose = () => {
        setReason("");
        setError("");
        modal.onClose();
    };

    const handleVoid = async () => {
        if (isSubmittingRef.current) return;

        if (!reason.trim()) {
            setError("Reason is required.");
            return;
        }

        const isConfirmed = await confirm({
            title: "Void Replenishment",
            message: `Are you sure you want to void ${replenishment?.replenishment_id}? This action cannot be undone.`,
        });
        if (!isConfirmed) return;

        isSubmittingRef.current = true;
        setVoiding(true);
        try {
            await voidReplenishment(replenishment?.id, { reason })
                .then((resp) => {
                    if (!resp.error) {
                        toast.success("Replenishment voided successfully.");
                        handleClose();
                        onSuccess();
                    } else {
                        toast.error(resp.data?.message || "Error voiding replenishment");
                    }
                })
                .catch(() => toast.error("Error encountered"));
        } finally {
            setVoiding(false);
            isSubmittingRef.current = false;
        }
    };

    return (
        <Modal
            isShowing={modal.isShowing}
            title={`Void Replenishment${replenishment?.replenishment_id ? ` — ${replenishment.replenishment_id}` : ""}`}
            onClose={handleClose}
            size="md"
        >
            {/* <p className="text-sm text-gray-600 dark:text-neutral-300 mb-3">
                Voiding will mark this replenishment as Voided so you can create a corrected one. Included cash issuances are not affected since their status only changes once a replenishment is posted.
            </p> */}
            <TextArea
                label="Reason for Voiding"
                name="reason"
                required
                value={reason}
                error={error}
                onChange={(e) => {
                    setReason(e.target.value);
                    if (error) setError("");
                }}
            />
            <hr className="mt-5 mb-3 border-slate-200 dark:border-neutral-700" />
            <div className="flex justify-end gap-x-2">
                <Button label="Cancel" variant="secondary" onClick={handleClose} />
                <Button label="Void" loading={voiding} onClick={handleVoid} />
            </div>
        </Modal>
    );
};

export default VoidReplenishmentModal;
