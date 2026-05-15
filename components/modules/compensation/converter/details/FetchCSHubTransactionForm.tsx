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
import moment from "moment";
import { formatNumber } from "@/helper/amount";

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
    const [resetRows, setReset] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const trasanctionsFormHandler = useFormik({
        initialValues: {
            type: "",
            approved_from: moment().subtract(4, "month").format("YYYY-MM-DD"),
            approved_to: moment().format("YYYY-MM-DD"),
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            type: Yup.string().required("Type is required"),
            approved_from: Yup.string().required("Posted from is required"),
            approved_to: Yup.string().required("Posted to is required"),
        }),
        onSubmit: (values, {setSubmitting, resetForm}) => {
            setSubmitting(true);
            setSelectedTransactions([]);
            setReset(prev => !prev);

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
            columnHead: "Transaction Number",
            path: "trans_no",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Transaction Type",
            path: "healthcare_transaction_type.description",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Approved Amount",
            path: "original_amount",
            columnType: COLUMNTYPES.function,
            function: (data:any) => {
                const amount =  data.original_amount ?? data.orig_amount;

                return formatNumber(amount);
            }
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
                setDataset([]);
                setReset(prev => !prev);
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
                    label="Approved Date From"
                    name="approved_from"
                    required
                    onChange={trasanctionsFormHandler.handleChange}
                    value={trasanctionsFormHandler.values.approved_from}
                    error={trasanctionsFormHandler.errors.approved_from}
                />
                <Textfield
                    type="date"
                    label="Approved Date To"
                    name="approved_to"
                    required
                    onChange={trasanctionsFormHandler.handleChange}
                    value={trasanctionsFormHandler.values.approved_to}
                    error={trasanctionsFormHandler.errors.approved_to}
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

            <p className="mt-3">Details</p>
            <div className="max-h-[500px] overflow-hidden overflow-y-auto">
                <Table
                    withCheckBox
                    onCheck={(e) => {
                        setSelectedTransactions(e);
                    }}
                    columnSettings={columnSettings}
                    dataSet={dataSet}
                    loading={trasanctionsFormHandler.isSubmitting}
                    smallText
                    resetRows={resetRows}
                />
            </div>

            { dataSet.length > 0 &&
                (
                    <div className="flex justify-end items-center mt-2">
                        <div>
                            <Button
                                loading={loading}
                                onClick={async () => {
                                    const isConfirmed = await confirm({
                                        message: "Are you sure you want to generate?",
                                        title: "Generate Batch"
                                    });

                                    if (isConfirmed) {
                                        setLoading(true);
                                        const transactionDataset = dataSet;

                                        const transactions =  transactionDataset
                                        .filter((trans: any) => selectedTransactions.includes(trans.id))
                                        .map((trans: any) => {
                                            if (selectedTransactions.includes(trans.id)) {
                                                return ({
                                                    id: trans.id,
                                                    employee_number: trans.user.employee_number,
                                                    branch_number: trans.branch_id,
                                                    terms: trans.terms ?? 0,
                                                    purpose: trans.purpose ?? trans.procedure,
                                                    amount: trans.original_amount ?? trans.orig_amount,
                                                    transaction_type: trans.healthcare_transaction_type.description ?? null,
                                                    for_crediting: trans.healthcare_transaction_type.for_credit ?? trans.healthcare_transaction_type.for_crediting ?? null,
                                                    for_liquidation: trans.healthcare_transaction_type.for_liquidation ?? null,
                                                    transaction_number: trans.trans_no,
                                                    type: trasanctionsFormHandler.values.type,
                                                    exam_type: trans?.health_loan_exam_type?.description ?? null
                                                });
                                            }
                                        });

                                        createCShubAppliedTransactions({
                                            selected_transactions: transactions,
                                        }).then((resp) => {
                                            if (!resp.error) {
                                                toast.success("Transactions successfully created");

                                                if (transactionDataset.length == selectedTransactions.length) {
                                                    modal.onClose();
                                                    setDataset([]);
                                                    trasanctionsFormHandler.resetForm();
                                                }

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