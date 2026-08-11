"use client";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface ValidationModalInterface {
    validationData: any,
    modal: any,
    type: "Allocation" | "Payroll"
    allocation_id: number,
    payload?: any,
    api: (payload: any, id: number) => Promise<any>;
};

const EntryValidationModal = ({
    validationData,
    modal,
    type,
    allocation_id = 0,
    payload = {},
    api
} : ValidationModalInterface) => {

    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<any>({});

    useEffect(() => {
        setData(validationData);
    }, [validationData])

    return (
        <Modal
            title="Entry Validation"
            isShowing={modal.isShowing}
            showCloseButton
            size="md"
            onClose={() => {
                modal.onClose();
            }}
        >
            { (data.branches_on_different_company && data.branches_on_different_company.length > 0) &&
                <>
                    <p className="font-semibold">Branches in Different Company:</p>
                    {data.branches_on_different_company.map((branches: string, idx: number) => {
                            return <p key={idx}>{branches}</p>
                        })
                    }

                    <div className="pb-5"/>
                </>
            }

            { (data.branches_without_13th_month_accounts && data.branches_without_13th_month_accounts.length > 0) &&
                <>
                    <p className="font-semibold">Branches With Missing Accounts:</p>
                    {data.branches_without_13th_month_accounts.map((branches: string, idx: number) => {
                            return <p key={idx}>{branches}</p>
                        })
                    }

                    <div className="pb-5"/>
                </>
            }

            <div className="flex justify-end gap-2">
                <Button
                    label="Cancel"
                    variant="secondary"
                    onClick={modal.onClose}
                />
                <Button
                    label="Proceed"
                    loading={loading}
                    onClick={async () => {
                        setLoading(true);
                        try {
                            if (type === "Allocation") {
                                const resp = await api({proceed: "Yes"}, allocation_id);

                                if (!resp.error) {
                                    toast.success(resp.data.message);
                                    modal.onClose();
                                } else {
                                    toast.error(resp.data.message);
                                }
                            } else {
                                const resp = await api({... payload, proceed: "Yes"}, 0);

                                if (!resp.error) {
                                    toast.success(resp.data.message);
                                    modal.onClose();
                                } else {
                                    toast.error(resp.data.message);
                                }
                            }
                        } catch {
                            toast.error("Error encountered");
                        } finally {
                            setLoading(false);
                        }
                    }} 
                />
            </div>
        </Modal>
    );
};

export default EntryValidationModal;