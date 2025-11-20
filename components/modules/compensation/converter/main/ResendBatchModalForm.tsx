import { resendTransactionEmail } from "@/api/compensation/converter";
import Button from "@/components/common/Button";
import confirm from "@/components/common/Confirm";
import Modal from "@/components/common/Modal";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

interface ModalInterface {
    modal: any;
    dataSet: any[];
}

const ResendBatchModalForm = ({
    modal,
    dataSet = []
}: ModalInterface) => {

    const [selectedTransactions, setSelectedTransactions] = useState<any[]>([]);

    const columnSettings = [
        {
            columnHead: "Date Created",
            path: "created_at",
            columnType: COLUMNTYPES.date
        },
        {
            columnHead: "Employee",
            path: "employee.full_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Transaction Type",
            path: "transaction_type.description",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Amount",
            path: "amount",
            columnType: COLUMNTYPES.amount
        },
        ];

    return (
        <Modal
            size="lg"
            isShowing = {modal.isShowing}
            onClose = {() => {
                modal.onClose();
                setSelectedTransactions([]);
            }}
            title="Transaction Details"
        >
            <Table
                smallText
                dataSet={dataSet}
                columnSettings={columnSettings}
                withCheckBox
                onCheck={(e) => {
                    setSelectedTransactions(e);
                }}
            />

            <div className="flex justify-end">
                <div>
                    <Button
                        label="Resend"
                        onClick={ async () => {
                            const isConfirmed = await confirm({
                                message: "Are you sure you want to resend?",
                                title: "Resend Email"
                            });
                            
                            if (isConfirmed) {
                                resendTransactionEmail(
                                    dataSet[0].converter_main_id,
                                    {
                                        selected_transactions: selectedTransactions
                                    }
                                ).then((resp) => {
                                    if (!resp.error) {
                                        toast.success("Email resend successfully");
                                        modal.onClose();
                                    } else {
                                        toast.error(resp.data.message);
                                    }
                                }).catch(() => {
                                    toast.error("Error encountered");
                                });
                            }
                        }}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default ResendBatchModalForm;