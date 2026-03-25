"use client";

import Card from "@/components/common/Card";
import Grid from "@/components/common/Grid";
import Textfield from "@/components/common/Textfield";
import { PayrollContext } from "@/context/PayrollProvider";
import { AuthContext } from "@/context/AuthProvider";
import { useContext, useEffect, useState } from "react";
import BranchDropDown from "../../../generic/BranchDropDown";
import Button from "@/components/common/Button";
import confirm from "@/components/common/Confirm";
import { toast } from "react-toastify";
import { updatePayrollTimekeepingBranch } from "@/api/compensation/payroll";

const EmployeeDetailCard = () => {
    const { loading, payrollDetails, setPayrollDetails } = useContext(PayrollContext);
    const { permissions } = useContext(AuthContext);
    const [timekeepingBranchId, setTimekeepingBranchId] = useState<any>("");
    const [saving, setSaving] = useState(false);

    const isMaternityLeave = payrollDetails?.details.is_on_maternity_leave === 1;
    const canEdit = permissions.includes("perform_compensation_payroll") && payrollDetails.status !== "final";

    useEffect(() => {
        const selectedId = payrollDetails?.timekeeping_branch?.id
            ?? "";
        setTimekeepingBranchId(selectedId);
    }, [payrollDetails]);

    const handleSaveTimekeepingBranch = async () => {
        if (!timekeepingBranchId) {
            toast.error("Timekeeping Branch is required");
            return;
        }

        const isConfirmed = await confirm({
            title: "Timekeeping Branch",
            message: "Are you sure you want to update the timekeeping branch?"
        });

        if (!isConfirmed) {
            return;
        }

        setSaving(true);
        updatePayrollTimekeepingBranch(payrollDetails.id, {
            timekeeping_branch_id: timekeepingBranchId
        })
        .then((resp) => {
            if (!resp.error) {
                toast.success(resp.data.message);
                setPayrollDetails(resp.data.details);
            } else {
                toast.error(resp.data.message);
            }
        })
        .catch(() => {
            toast.error("Error encountered");
        })
        .finally(() => {
            setSaving(false);
        });
    };
    return (
        <Card
            size="small"
            loading={loading}
        >
            <p className="font-semibold text-red-800 dark:text-red-500">Employee Details</p>
            <Grid cols={3}> 
                <Textfield
                    disabled
                    label="Employee"
                    value={payrollDetails.employee.full_name ?? ""}
                />
                <Textfield
                    disabled
                    label="Employee Number"
                    value={payrollDetails.employee.employee_number ?? ""}
                />
                <Textfield
                    disabled
                    label="Position"
                    value={payrollDetails?.position?.description ?? ""}
                />
                {/* <Textfield
                    disabled
                    label="Home Branch"
                    value={payrollDetails?.?.name ?? ""}
                /> */}
                {isMaternityLeave ? (
                    <BranchDropDown
                        label="Timekeeping Branch"
                        placeholder="select branch"
                        name="timekeeping_branch_id"
                        value={timekeepingBranchId}
                        disabled={!canEdit}
                        onChange={(e) => {
                            setTimekeepingBranchId(e.target.value);
                        }}
                    />
                ) : (
                    <Textfield
                        disabled
                        label="Timekeeping Branch"
                        value={payrollDetails?.timekeeping_branch?.name}
                    />
                )}
                <Textfield
                    disabled
                    label={payrollDetails?.payroll_list?.current_bank_details?.bank_account_type_id == "2" ? "Savings Account" : "Cash Card"}
                    value={payrollDetails?.payroll_list?.current_bank_details?.bank_number}
                />
                <Textfield
                    disabled
                    label="Payment Type"
                    value={payrollDetails.pay_type ?? ""}
                />
                <Textfield
                    disabled
                    label="Tax Type"
                    value={payrollDetails.tax_status ?? ""}
                />
            </Grid>
            {isMaternityLeave && canEdit && (
                <div className="flex justify-end">
                    <div className="w-[180px]">
                        <Button
                            label="Save changes"
                            type="button"
                            loading={saving}
                            onClick={handleSaveTimekeepingBranch}
                        />
                    </div>
                </div>
            )}
        </Card>
    );
};

export default EmployeeDetailCard;
