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
import { useAsyncEffect } from "@/hooks/async-effect";
import { getEmployeeDeduction } from "@/api/compensation/employee-deductions";
import ViewEmployeeDeduction from "../../employee-deductions/ViewEmployeeDeduction";

const PayrollDeductionTableCard = ({ formHandler } : {formHandler : any}) => {
    const { loading, setPayrollDetails, payrollDetails } = useContext(PayrollContext);
    const editModal = useModal();
    const viewModal = useModal();
    const [deductionId, setDeductionId] = useState<number>(0);
    const [data, setData] = useState<any>({});

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

    useAsyncEffect(async () => {
        if (viewModal.isShowing) {
            viewModal.setLoading(true);
            try {
                const resp = await getEmployeeDeduction(deductionId);

                if (!resp.error) {
                    setData(resp.data);
                } else {
                    setDeductionId(0);
                    viewModal.onClose();
                    setData({});
                    toast.error("Error fetching deduction details");
                }
            } catch {
                setData({});
                setDeductionId(0);
                viewModal.onClose();
                toast.error("Error fetching deduction details");
            } finally {
                viewModal.setLoading(false);
            }
        }
    }, [deductionId]);

    const initialActionSettings = [
        {
            label: "Edit Amount",
            onClick: (data:any) => {
                editModal.onOpen();
                setData(data);
            }
        },
        {
            label: "Remove",
            onClick: (data:any) => {
                const deductionId = data.deduction_id;
                const deductionArray = [...formHandler.values.deductions];
                const newDeductionArray = deductionArray.filter(item => item.deduction_id != deductionId);
                formHandler.setFieldValue("deductions", newDeductionArray);
                formHandler.setFieldValue("save_changes", false);
                formHandler.setFieldValue("reload_deductions", false);
                formHandler.setFieldValue("modify_deductions", true);
                formHandler.submitForm();
            }
        }
    ];

    const actionSettings = [
        {
            label: "View",
            onClick: (data: any) => {
                viewModal.onOpen();
                setDeductionId(data.deduction_id);
            }
        }
    ];

    return (
        <>
            <Card
                size="medium"
                loading={loading}
            >
                <div className="flex justify-between">
                    <p className="font-semibold text-blue-950 dark:text-red-500">Company Deductions</p>
                    { payrollDetails.status == "initial" &&
                        <p
                            className="hover:text-blue-950 dark:text-red-500 hover:cursor-pointer"
                            onClick={() => {
                                formHandler.setFieldValue("save_changes", false);
                                formHandler.setFieldValue("reload_deductions", true);
                                formHandler.setFieldValue("modify_deductions", true);
                                formHandler.submitForm();
                            }}
                        >
                            Reload Deductions
                        </p>
                    }

                </div>
                <Table
                    dataSet={formHandler.values.deductions}
                    columnSettings={columnSettings}
                    withActions={true}
                    actions={payrollDetails.status === "initial" ? initialActionSettings : actionSettings} 
                />
            </Card>

            <ViewEmployeeDeduction
                modal={viewModal}
                data={data}
            />
            <EditDeductionDetails
                modal={editModal}
                formValue={data}
                formHandler={formHandler}
            />
        </>
    );
};

export default PayrollDeductionTableCard;