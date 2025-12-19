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
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { createCSHubATDs, getCSHubATDS } from "@/api/compensation/employee-deductions";

interface ModalInterface {
    modal: any;
    onSubmitCallback: () => void;
}

const FetchATDCshubModal = ({
    modal,
    onSubmitCallback
}: ModalInterface) => {

    const api = useApiCall();
    const [selectedTransactions, setSelectedTransactions] = useState<any[]>([]);

    useAsyncEffect(() => {
        if (modal.isShowing) {
            api.setLoading(true);

            getCSHubATDS()
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
            })
        }
    }, [modal.isShowing]);

    const columnSettings = [
        {
            columnHead: "Transaction Number",
            path: "transaction_number",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Branch",
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
            columnHead: "Amount",
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
                api.setDataSet([]);
            }}
            title="CSHub ATD Records"
        >
            <Table
                dataSet={api.dataSet}
                loading={api.loading}
                columnSettings={columnSettings}
                smallText
                withCheckBox
                dataKey="atd_employee_id"
                onCheck={(e) => {
                    setSelectedTransactions(e);
                }}
            />

            <div className="flex justify-end items-center mt-2">
                <div>
                    <Button
                        label="Import ATDs"
                        onClick={async () => {
                            const isConfirm = await confirm({
                                title: "Import ATDS",
                                message: "Are you sure you want to save records?"
                            });

                            if (isConfirm) {
                                const transactions =  api.dataSet
                                .filter((trans: any) => selectedTransactions.includes(trans.atd_employee_id))
                                .map((trans: any) => {
                                    if (selectedTransactions.includes(trans.atd_employee_id)) {
                                        return trans;
                                    }
                                });
    
                                createCSHubATDs({
                                    transactions
                                }).then((resp) => {
                                    if (!resp.error) {
                                        onSubmitCallback();
                                        setSelectedTransactions([]);
                                        modal.onClose();
                                        toast.success("ATD successfully created");
                                    } else {
                                        toast.error(resp.data.message);
                                    }
                                }).catch(() => {
                                    toast.error("Error encountered");
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