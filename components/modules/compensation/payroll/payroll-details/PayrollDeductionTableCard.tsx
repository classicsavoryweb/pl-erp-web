"use client";

import { updatePayrollDeduction } from "@/api/compensation/payroll";
import Card from "@/components/common/Card";
import confirm from "@/components/common/Confirm";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { PayrollContext } from "@/context/PayrollProvider";
import { useModal } from "@/hooks/modal";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import EditDeductionDetails from "./EditDeductionDetails";

const PayrollDeductionTableCard = () => {
    const { loading, setPayrollDetails, payrollDetails } = useContext(PayrollContext);
    const [dataSet, setDataSet] = useState<any[]>([]);
    const editModal = useModal();
    const [data, setData] = useState<any>({});

    useEffect(() => {
        if (!loading) {
            setDataSet(JSON.parse(payrollDetails.deductions) ?? []);
        }
    }, [loading, payrollDetails.deductions.length]);

    const columnSettings = [
        {
            columnHead: "Description",
            path: "type",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Remaining Balance",
            path: "balance",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "Monthly Amortization",
            path: "monthly_amortization",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "Deducted Amount",
            path: "deducted_amount",
            columnType: COLUMNTYPES.amount
        },
    ];

    const actionSettings = [
        {
            label: "Edit Amount",
            onClick: (data:any) => {
                editModal.onOpen();
                setData(data);
            }
        },
        {
            label: "Remove",
            onClick: async (data:any) => {
                const isConfirmed = await confirm({
                    message : "Are you sure you want to save changes",
                    title: "Deduction"
                });

                isConfirmed && updatePayrollDeduction(payrollDetails.id, { deduction_id: data.deduction_id})
                .then((resp) => {
                    if (!resp.error) {
                        toast.success(resp.data.message);
                        setPayrollDetails(resp.data.details);
                    } else {
                        toast.error(resp.data.message);
                    }
                }).catch(() => {
                    toast.error("Error encountered");
                })
            }
        }
    ];

    return (
        <>
            <Card
                size="medium"
                loading={loading}
            >
                <p className="font-semibold text-red-800">Company Deductions</p>
                <Table
                    dataSet={dataSet}
                    columnSettings={columnSettings}
                    withActions={payrollDetails.status === "initial"}
                    actions={actionSettings}
                />
            </Card>
            <EditDeductionDetails
                modal={editModal}
                formValue={data}
            />
        </>
    );
};

export default PayrollDeductionTableCard;