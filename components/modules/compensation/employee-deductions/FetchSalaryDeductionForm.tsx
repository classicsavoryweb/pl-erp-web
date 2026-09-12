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
import { createCSHubATDs, createHealthCareForSalaryDeduction, getAllHealthcareForSalaryDeduction, getCSHubATDS } from "@/api/compensation/employee-deductions";
import BranchDropDown from "../../generic/BranchDropDown";
import moment from "moment";
import ATDDeductionDropDown from "../../generic/ATDDeductionDropDown";
import { formatNumber } from "@/helper/amount";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useApiCall } from "@/hooks/api-call";

interface ModalInterface {
    modal: any;
    onSubmitCallback: () => void;
}

const FetchSalaryDeductionForm = ({
    modal,
    onSubmitCallback
}: ModalInterface) => {

    const api = useApiCall();
    const [selectedTransactions, setSelectedTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [resetRows, setReset] = useState<boolean>(false);
    const totalAmount = api.dataSet.reduce((sum, item) => sum + Number(item?.actual_liq_difference ?? 0), 0);


    useAsyncEffect(() => {
        if (modal.isShowing) {
            api.setLoading(true);
            getAllHealthcareForSalaryDeduction()
            .then((resp) => {
                if (!resp.error) {
                    api.setDataSet(resp.data.transactions);
                } else {
                    toast.error(resp.data.message);
                }
            }).catch(() => {
                toast.error("Error encountered");
            }).finally(() => {
                api.setLoading(false);
            });
        }
    }, [modal.isShowing]);

    const columnSettings = [
        {
            columnHead: "Transaction Number",
            path: "trans_no",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Type",
            path: "healthcare_transaction.healthcare_transaction_type.description",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Employee",
            path: "healthcare_transaction.user.full_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Employee Number",
            path: "healthcare_transaction.user.employee_number",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "For Salary Deduction",
            path: "actual_liq_difference",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "Procedure",
            path: "healthcare_transaction.procedure",
            columnType: COLUMNTYPES.string
        },
    ];

    return (
        <Modal
            size="xxl"
            isShowing = {modal.isShowing}
            onClose = {() => {
                modal.onClose();
                api.setDataSet([]);
                setReset(prev => !prev);
            }}
            title="For Salary Deduction"
        >
            <div className="mt-3 flex items-center justify-between">
                <p>Details</p>
                <p>
                    Count: {api.dataSet.length} | Total: {formatNumber(totalAmount)}
                </p>
            </div>
            <div className="max-h-[500px] overflow-hidden overflow-y-auto">
                <Table
                    dataSet={api.dataSet}
                    loading={api.loading}
                    columnSettings={columnSettings}
                    smallText
                    withCheckBox
                    dataKey="id"
                    resetRows={resetRows}
                    onCheck={(e) => {
                        setSelectedTransactions(e);
                    }}
                />
            </div>

            <div className="flex justify-end items-center mt-2">
                <div>
                    <Button
                        label="Import Transactions"
                        loading={loading}
                        disabled={loading}
                        onClick={async () => {
                            const isConfirm = await confirm({
                                title: "Import Transactions",
                                message: "Are you sure you want to save records?"
                            });

                            if (isConfirm) {
                                const transactions =  api.dataSet
                                .filter((trans: any) => selectedTransactions.includes(trans.id))
                                .map((trans: any) => {
                                    if (selectedTransactions.includes(trans.id)) {
                                        return trans;
                                    }
                                });

                                setLoading(true);
                                createHealthCareForSalaryDeduction({
                                    transactions
                                }).then((resp) => {
                                    if (!resp.error) {
                                        setSelectedTransactions([]);
                                        modal.onClose();
                                        setReset(prev => !prev);
                                        api.setDataSet([]);
                                        onSubmitCallback();
                                        toast.success("Deduction successfully created");
                                    } else {
                                        toast.error(resp.data.message);
                                    }
                                }).catch(() => {
                                    toast.error("Error encountered");
                                }).finally(() => {
                                    setLoading(false);
                                });
                            }
                        }}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default FetchSalaryDeductionForm;
