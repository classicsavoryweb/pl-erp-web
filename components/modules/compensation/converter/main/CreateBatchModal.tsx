import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import Button from "@/components/common/Button";
import confirm from "@/components/common/Confirm";
import SearchEmployeeDropDown from "@/components/modules/generic/SearchEmployeeDropDown";
import CSHubTransactionTypeDropDown from "@/components/modules/generic/CSHubTransactionTypeDropDown";
import TextArea from "@/components/common/TextArea";
import TermsDropDown from "@/components/modules/generic/TermsDropDown";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createConverterDetails, createConverterMain, getConverterTransactions } from "@/api/compensation/converter";
import { toast } from "react-toastify";
import Grid from "@/components/common/Grid";
import BankAccountTypeDropDown from "@/components/modules/generic/BankAccounTypeDropDown";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useEffect, useState } from "react";

interface ModalInterface {
    modal: any;
    onSubmitCallback: () => void;
}

const CreateBatchModal = ({
    modal,
    onSubmitCallback
}: ModalInterface) => {

    const [dataSet, setDataset] = useState<any[]>([]);
    const [selectedTransactions, setSelectedTransactions] = useState<any[]>([]);

    const trasanctionsFormHandler = useFormik({
        initialValues: {
            bank_account_type_id: "",
            transaction_type_id: "",
            status: "Pending"
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            bank_account_type_id: Yup.string().required("Account type is required"),
            status: Yup.string().default("Pending")
        }),
        onSubmit: (values, {setSubmitting, resetForm}) => {
            setSubmitting(true);
            setSelectedTransactions([]);
            getConverterTransactions(values)
            .then((resp) => {
                if (!resp.error) {
                    setDataset(resp.data.transactions);
                } else {
                    toast.error(resp.data.message);
                    setDataset([]);                    
                }
            }).catch(() => {
                toast.error("Error encountered");
                setDataset([]);
            }).finally(() => {
                setSubmitting(false);
            });
        }
    });

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
            size="xl"
            isShowing = {modal.isShowing}
            onClose = {() => {
                modal.onClose();
                trasanctionsFormHandler.resetForm();
            }}
            title="Batch Converter"
        >
            <form onSubmit={trasanctionsFormHandler.handleSubmit}>
            <Grid
                cols={2}
            >
                <BankAccountTypeDropDown
                    label="Bank Account Type"
                    placeholder="select account type"
                    name="bank_account_type_id"
                    required
                    value={trasanctionsFormHandler.values.bank_account_type_id}
                    error={trasanctionsFormHandler.errors.bank_account_type_id}
                    onChange={trasanctionsFormHandler.handleChange}
                />
                <CSHubTransactionTypeDropDown
                    label="Transaction Type"
                    placeholder="select transaction type"
                    name="transaction_type_id"
                    required
                    value={trasanctionsFormHandler.values.transaction_type_id}
                    error={trasanctionsFormHandler.errors.transaction_type_id}
                    onChange={trasanctionsFormHandler.handleChange}
                />
            </Grid>

            <div className="mt-1 w-full flex justify-end items-center">
                <div>
                    <Button
                        type="submit"
                        label="Submit"
                        onClick={() => {}}
                    />
                </div>
            </div>
            </form>

            <hr className="text-slate-300 my-3"/>
            <p>Details</p>

            <Table
                withCheckBox
                onCheck={(e) => {
                    const value = e.target.value;
                    if (e.target.checked) {
                        setSelectedTransactions(prev => [
                            ...prev,
                            value
                        ]);
                    } else {
                        setSelectedTransactions(prev => 
                            prev.filter(sel => Number(sel) !== Number(value))
                        );
                    }
                }}
                columnSettings={columnSettings}
                dataSet={dataSet}
                loading={trasanctionsFormHandler.isSubmitting}
                smallText
            />

            { dataSet.length > 0 &&
                (
                    <div className="flex justify-end items-center mt-2">
                        <div>
                            <Button
                                onClick={async () => {
                                    const isConfirmed = await confirm({
                                        message: "Are you sure you want to generate?",
                                        title: "Generate Batch"
                                    });

                                    if (isConfirmed) {
                                        createConverterMain({
                                            selected_transactions: selectedTransactions,
                                            bank_account_type_id: trasanctionsFormHandler.values.bank_account_type_id,
                                            transaction_type_id: trasanctionsFormHandler.values.transaction_type_id,
                                        }).then((resp) => {
                                            if (!resp.error) {
                                                toast.success("Batch successfully created");
                                                onSubmitCallback();
                                                modal.onClose();
                                            } else {
                                                toast.error(resp.data.message);
                                            }
                                        }).catch(() => {
                                            toast.error("Error encountered");
                                        });
                                    }
                                }}
                                label="Create Batch"
                            />
                        </div>
                    </div>
                )
            }
        </Modal>
    );
};

export default CreateBatchModal;