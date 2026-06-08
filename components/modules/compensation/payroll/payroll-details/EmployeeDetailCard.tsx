"use client";

import Card from "@/components/common/Card";
import Grid from "@/components/common/Grid";
import Textfield from "@/components/common/Textfield";
import { PayrollContext } from "@/context/PayrollProvider";
import { AuthContext } from "@/context/AuthProvider";
import { useContext, useEffect, useState } from "react";
import BranchDropDown from "../../../generic/BranchDropDown";
import Checkbox from "@/components/common/Checkbox";
import moment from "moment";

const EmployeeDetailCard = ({formHandler}: {formHandler: any}) => {
    const { loading, payrollDetails } = useContext(PayrollContext);
    const { permissions } = useContext(AuthContext);

    return (
        <Card
            size="small"
            loading={loading}
        >
            <div className="flex justify-between items-center">
                <p className="font-semibold text-red-800 dark:text-red-500">Employee Details</p>
                <p>Last Update: {moment(payrollDetails.updated_at).format("MMM D, YYYY hh:mm:ss A")}</p>
            </div>
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
                {payrollDetails.status == "initial" ? (
                    <BranchDropDown
                        label="Timekeeping Branch"
                        placeholder="select branch"
                        name="timekeeping_branch_id"
                        value={Number(formHandler.values.timekeeping_branch_id)}
                        onChange={formHandler.handleChange}
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
            <div className="flex gap-x-5">
                <div>
                    <Checkbox
                        label="On Hold"
                        value={1}
                        checked={formHandler.values.is_hold == 1}
                        onChange={(e) => {
                            if (payrollDetails.status == "initial") {
                                if (e.target.checked) {
                                    formHandler.setFieldValue("is_hold", 1);
                                } else {
                                    formHandler.setFieldValue("is_hold", 0);
                                }
                            }
                        }}
                    />
                </div>
                { payrollDetails.employee.gender == "Female" &&
                    <>
                        <Checkbox
                            label="Maternity Leave"
                            value={1}
                            checked={formHandler.values.is_on_maternity_leave == 1}
                            onChange={(e) => {
                                if (payrollDetails.status == "initial") {
                                    if (e.target.checked) {
                                        formHandler.setFieldValue("is_on_maternity_leave", 1);
                                    } else {
                                        formHandler.setFieldValue("is_on_maternity_leave", 0);
                                    }

                                    formHandler.setFieldValue("save_changes", false);
                                    formHandler.setFieldValue("reload_deductions", true);
                                    formHandler.submitForm();
                                }
                            }}
                        />
                    </>
                }
            </div>
        </Card>
    );
};

export default EmployeeDetailCard;
