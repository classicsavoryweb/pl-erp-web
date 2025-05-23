"use client";

import { createConfirmation, confirmable } from "react-confirm";
import Modal from "./Modal";
import { useState } from "react";
import Button from "./Button";

export interface ConfirmModalProps {
    title: string;
    message: string;
}

interface InternalConfirmProps extends ConfirmModalProps {
    proceed: (value?: any) => void;
}

const ConfirmBody = ({ title, message, proceed }: InternalConfirmProps) => {
    const [show, setShow] = useState(true);

    const handleConfirm = () => {
        setShow(false);
        proceed(true);
    };

    const handleCancel = () => {
        setShow(false);
        proceed(false);
    };

    return (
        <Modal isShowing={show} onClose={handleCancel} title={title} size="sm">
            <div className="space-y-6">
                <p className="text-gray-700">{message}</p>
                <div className="flex justify-end gap-2">
                <Button label="Cancel" variant="secondary" onClick={handleCancel} />
                <Button label="Confirm" onClick={handleConfirm} />
                </div>
            </div>
        </Modal>
    );
};

const Confirmable = confirmable<ConfirmModalProps, boolean>(ConfirmBody);
const confirm = createConfirmation<ConfirmModalProps, boolean>(Confirmable);

export default confirm;
