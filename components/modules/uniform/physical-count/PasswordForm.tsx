
"use client";

import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import Textfield from "@/components/common/Textfield";
import { toast } from "react-toastify";

interface PasswordFormProps {
    modal: any;
    password: string;
    setPassword: (value: string) => void;
    onConfirm: () => void;
}

const PasswordForm = ({
    modal,
    password,
    setPassword,
    onConfirm,
}: PasswordFormProps) => {
    const confirmPassword = () => {
        onConfirm();
    };

    const closeModal = () => {
        modal.onClose();
        setPassword("");
    };

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Enter Password"
            onClose={closeModal}
            size="sm"
        >
            <div
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        confirmPassword();
                    }
                }}
            >
                <Textfield
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPassword(e.target.value)
                    }
                />

                <div className="flex justify-end gap-2 mt-4">
                    <Button
                        type="button"
                        label="Cancel"
                        variant="secondary"
                        onClick={closeModal}
                    />

                    <Button
                        label="Confirm"
                        type="button"
                        onClick={confirmPassword}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default PasswordForm;

