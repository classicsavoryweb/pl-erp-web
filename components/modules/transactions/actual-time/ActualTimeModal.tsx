"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";

interface FormModalInterface {
    modal: any;
    data: any[];
};

const ActualTimeModal = ({
    modal,
    data = []
}: FormModalInterface) => {

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Biotime Logs"
            onClose={() => {
                modal.onClose();
            }}
            loading={modal.loading}
            size="lg"
        >
            { data.map((log, key) => {
                return (
                    <Textfield
                        key={key}
                        disabled
                        label={`${log.branch ? log.branch.name : "Head Office"} ${log.remarks ? " - " + log.remarks : ""}`}
                        value={log.punch_time}
                    />
                )
            })
            }
            <hr className="mt-6 pb-2 text-slate-300"/>
            <div className="flex justify-end">
                <div>
                    <Button
                        label="Cancel"
                        variant="secondary"
                        onClick={() => {
                            modal.onClose();
                        }}
                    />            
                </div>
            </div>
        </Modal>
    );
};

export default ActualTimeModal;