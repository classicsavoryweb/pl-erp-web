import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import Button from "@/components/common/Button";
import confirm from "@/components/common/Confirm";
import { useFormik } from "formik";
import * as Yup from "yup";
import {createCShubAppliedTransactions, getCshubAppliedTransactions } from "@/api/compensation/converter";
import { toast } from "react-toastify";
import Grid from "@/components/common/Grid";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useState } from "react";
import Dropdown from "@/components/common/Dropdown";

interface ModalInterface {
    modal: any;
    onSubmitCallback: () => void;
}

const FetchCSHubTransactionForm = ({
    modal,
    onSubmitCallback
}: ModalInterface) => {

    const [dataSet, setDataset] = useState<any[]>([]);
    const [selectedTransactions, setSelectedTransactions] = useState<any[]>([]);

    const trasanctionsFormHandler = useFormik({
        initialValues: {
            type: "",
            posted_from: "",
            posted_to: ""
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            type: Yup.string().required("Type is required"),
            posted_from: Yup.string().required("Posted from is required"),
            posted_to: Yup.string().required("Posted to is required"),
        }),
        onSubmit: (values, {setSubmitting, resetForm}) => {
            setSubmitting(true);
            setSelectedTransactions([]);
            getCshubAppliedTransactions(values)
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
            columnHead: "Employee",
            path: "user.full_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Transaction Type",
            path: "healthcare_transaction_type.description",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Amount",
            path: "amount",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "Posting Date",
            path: "posting_date",
            columnType: COLUMNTYPES.date
        },
        {
            columnHead: "Purpose",
            path: "remarks",
            columnType: COLUMNTYPES.function,
            function: (data:any) => {
                var purpose : string = "";
                if (trasanctionsFormHandler.values.type === "LOAN") {
                    purpose = data.purpose;
                } else {
                    purpose = data.procedure;
                }

                return purpose;
            }
        },
    ];

    return (
        <Modal
            size="xxl"
            isShowing = {modal.isShowing}
            onClose = {() => {
                modal.onClose();
                trasanctionsFormHandler.resetForm();
            }}
            title="CSHub Transactions"
        >
            <form onSubmit={trasanctionsFormHandler.handleSubmit}>
            <Grid
                cols={3}
            >
                <Dropdown
                    label="Type"
                    placeholder="select type"
                    name="type"
                    required
                    onChange={trasanctionsFormHandler.handleChange}
                    value={trasanctionsFormHandler.values.type}
                    error={trasanctionsFormHandler.errors.type}
                    options={[
                        {
                            label: "Loan",
                            value: "LOAN"
                        },
                        {
                            label: "Healthcare",
                            value: "HEALTHCARE"
                        }
                    ]}
                />
                <Textfield
                    type="date"
                    label="Date From"
                    name="posted_from"
                    required
                    onChange={trasanctionsFormHandler.handleChange}
                    value={trasanctionsFormHandler.values.posted_from}
                    error={trasanctionsFormHandler.errors.posted_from}
                />
                <Textfield
                    type="date"
                    label="Date To"
                    name="posted_to"
                    required
                    onChange={trasanctionsFormHandler.handleChange}
                    value={trasanctionsFormHandler.values.posted_to}
                    error={trasanctionsFormHandler.errors.posted_to}
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
            <div className="max-h-[500px] overflow-hidden overflow-y-auto">
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
            </div>

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
                                        const transactionDataset = dataSet;
                                        const transactions =  transactionDataset
                                        .filter((trans: any) => selectedTransactions.includes(String(trans.id)))
                                        .map((trans: any) => {
                                            if (selectedTransactions.includes(String(trans.id))) {
                                                return ({
                                                    id: trans.id,
                                                    employee_number: trans.user.employee_number,
                                                    branch_number: trans.branch_id,
                                                    terms: trans.terms,
                                                    purpose: trans.purpose ?? trans.procedure,
                                                    amount: trans.amount,
                                                    transaction_type: trans.healthcare_transaction_type.description ?? null,
                                                    transaction_number: trans.trans_no
                                                });
                                            }
                                        });

                                        createCShubAppliedTransactions({
                                            selected_transactions: transactions,
                                        }).then((resp) => {
                                            if (!resp.error) {
                                                toast.success("Transactions successfully created");
                                                onSubmitCallback();
                                            } else {
                                                toast.error(resp.data.message);
                                            }
                                        }).catch(() => {
                                            toast.error("Error encountered");
                                        });
                                    }
                                }}
                                label="Import Transactions"
                            />
                        </div>
                    </div>
                )
            }
        </Modal>
    );
};

export default FetchCSHubTransactionForm;