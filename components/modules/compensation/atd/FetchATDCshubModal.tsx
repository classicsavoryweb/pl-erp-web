import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import Button from "@/components/common/Button";
import confirm from "@/components/common/Confirm";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Grid from "@/components/common/Grid";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useState } from "react";
import { createCSHubATDs, getCSHubATDS } from "@/api/compensation/employee-deductions";
import BranchDropDown from "../../generic/BranchDropDown";
import moment from "moment";
import ATDDeductionDropDown from "../../generic/ATDDeductionDropDown";
import { formatNumber } from "@/helper/amount";

interface ModalInterface {
    modal: any;
    onSubmitCallback: () => void;
}

const FetchATDCshubModal = ({
    modal,
    onSubmitCallback
}: ModalInterface) => {

    const [dataSet, setDataSet] = useState<any[]>([]);
    const [selectedTransactions, setSelectedTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [resetRows, setReset] = useState<boolean>(false);
    const totalAmount = dataSet.reduce((sum, item) => sum + Number(item?.amount ?? 0), 0);

    const formHandler = useFormik({
        initialValues: {
            branch_id : "",
            transaction_number : "",
            deduction_id: "",
            date_from: moment().subtract(2, "month").startOf("month").format("YYYY-MM-DD"),
            date_to: moment().format("YYYY-MM-DD"),
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({

        }),
        onSubmit: (values, {setSubmitting, resetForm}) => {
            setSubmitting(true);
            setSelectedTransactions([]);
            setReset(prev => !prev);

            getCSHubATDS(values)
            .then((resp) => {
                if (!resp.error) {
                    setDataSet(resp.data.transactions);
                } else {
                    toast.error(resp.data.message);
                }
            }).catch(() => {
                toast.error("Error encountered");
            }).finally(() => {
                setSubmitting(false);
            })
        }
    });

    const columnSettings = [
        {
            columnHead: "Transaction Number",
            path: "transaction_number",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "ATD Branch",
            path: "branch_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Transaction Date",
            path: "transaction_date",
            columnType: COLUMNTYPES.date
        },
        {
            columnHead: "Employee",
            path: "name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Employee Number",
            path: "employee_number",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "ATD Amount",
            path: "amount",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "Type",
            path: "type",
            columnType: COLUMNTYPES.string
        }
    ];

    return (
        <Modal
            size="xxl"
            isShowing = {modal.isShowing}
            onClose = {() => {
                modal.onClose();
                setDataSet([]);
                setReset(prev => !prev);
                formHandler.resetForm();
            }}
            title="CSHub ATD Records"
        >
            <form onSubmit={formHandler.handleSubmit}>
                <Grid cols={4}>
                    <Textfield
                        label="Transaction Date From"
                        name="date_from"
                        type="date"
                        onChange={formHandler.handleChange}
                        value={formHandler.values.date_from}
                        error={formHandler.errors.date_from}
                    />
                    <Textfield
                        label="Transaction Date To"
                        name="date_to"
                        type="date"
                        onChange={formHandler.handleChange}
                        value={formHandler.values.date_to}
                        error={formHandler.errors.date_to}
                    />
                    <ATDDeductionDropDown
                        label="Deduction Type"
                        name="deduction_id"
                        onChange={formHandler.handleChange}
                        value={formHandler.values.deduction_id}
                        placeholder="select deduction"
                    />
                    <BranchDropDown
                        label="Branch"
                        name="branch_id"
                        onChange={formHandler.handleChange}
                        value={formHandler.values.branch_id}
                        placeholder="select branch"
                    />
                    <Textfield
                        label="Transaction Number"
                        name="transaction_number"
                        onChange={formHandler.handleChange}
                        value={formHandler.values.transaction_number}
                        placeholder="enter transaction number"
                    />
                </Grid>
                <div className="mt-1 w-full flex justify-end items-center">
                    <div>
                        <Button
                            type="submit"
                            label="Search"
                            onClick={() => {}}
                        />
                    </div>
                </div>
            </form>

            <div className="mt-3 flex items-center justify-between">
                <p>Details</p>
                <p>
                    Total Count: {dataSet.length} | Total: {formatNumber(totalAmount)}
                </p>
            </div>
            <div className="max-h-[500px] overflow-hidden overflow-y-auto">
                <Table
                    dataSet={dataSet}
                    loading={formHandler.isSubmitting}
                    columnSettings={columnSettings}
                    smallText
                    withCheckBox
                    dataKey="atd_employee_id"
                    resetRows={resetRows}
                    onCheck={(e) => {
                        setSelectedTransactions(e);
                    }}
                />
            </div>

            <div className="flex justify-end items-center mt-2">
                <div>
                    <Button
                        label="Import ATDs"
                        loading={loading}
                        disabled={loading}
                        onClick={async () => {
                            const isConfirm = await confirm({
                                title: "Import ATDS",
                                message: "Are you sure you want to save records?"
                            });

                            if (isConfirm) {
                                const transactions =  dataSet
                                .filter((trans: any) => selectedTransactions.includes(trans.atd_employee_id))
                                .map((trans: any) => {
                                    if (selectedTransactions.includes(trans.atd_employee_id)) {
                                        return trans;
                                    }
                                });
                                setLoading(true);
                                createCSHubATDs({
                                    transactions
                                }).then((resp) => {
                                    if (!resp.error) {
                                        onSubmitCallback();
                                        setSelectedTransactions([]);
                                        modal.onClose();
                                        formHandler.resetForm();
                                        setDataSet([]);
                                        setReset(prev => !prev);
                                        toast.success("ATD successfully created");
                                    } else {
                                        toast.error(resp.data.message);
                                    }
                                }).catch(() => {
                                    toast.error("Error encountered");
                                }).finally(() => {
                                    setLoading(false);
                                })
                            }
                        }}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default FetchATDCshubModal;
