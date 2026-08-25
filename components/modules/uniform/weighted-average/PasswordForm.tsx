"use client";

import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import Textfield from "@/components/common/Textfield";
import TextArea from "@/components/common/TextArea";


interface passwordProps{
    modal:any;
    password:string;
    setPassword:any;
    confirmPassword:()=>void;
}

const PasswordForm = ({
    modal,
    password,
    setPassword,
    confirmPassword,
}:passwordProps) => {
    
    return (
        <Modal
            isShowing={modal.isShowing}
            title="Enter Password"
            onClose={ () => {
                modal.onClose();
                setPassword("");
            }}
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
                    onChange={(e: any) => setPassword(e.target.value)}
                />

                <div className="flex justify-end gap-2 mt-4">
                    <Button
                        type="button"
                        label="Cancel"
                        variant="secondary"
                        onClick={() => {
                            modal.onClose();
                            setPassword("");
                        }}
                    />

                    <Button
                        label="Confirm"
                        type="button"
                        onClick={confirmPassword}
                    />
                </div>
            </div>
        </Modal>
    )
};

export default PasswordForm;