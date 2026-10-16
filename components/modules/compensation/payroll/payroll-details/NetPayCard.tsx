"use client";

import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import TextArea from "@/components/common/TextArea";
import Textfield from "@/components/common/Textfield";
import { AuthContext } from "@/context/AuthProvider";
import { PayrollContext } from "@/context/PayrollProvider";
import { formatNumber } from "@/helper/amount";
import { useContext } from "react";

const NetPayCard = ({ formHandler } : { formHandler: any }) => {
    const { loading, payrollDetails } = useContext(PayrollContext);
    const { permissions } = useContext(AuthContext);

    return (
        <Card
            size="medium"
            loading={loading}
        >
            <p className="font-semibold text-blue-950 dark:text-red-500">Salary</p>
            <Textfield
                disabled
                label="Basic Salary"
                value={formatNumber(payrollDetails.salary)}
            />
            <Textfield
                disabled
                label="Additional Working Hours Pay"
                value={formatNumber(payrollDetails.additional_working_hours_total)}
            />
            <Textfield
                disabled
                label="Working Hours Deductions"
                value={formatNumber(payrollDetails.working_hours_deduction_total)}
            />
            <Textfield
                disabled
                label="Gross Salary"
                value={formatNumber(payrollDetails.gross_pay)}
            />
            <Textfield
                disabled
                label="Contributions"
                value={formatNumber(payrollDetails.contribution_total)}
            />
            <Textfield
                disabled
                label="Taxable Income"
                value={formatNumber(payrollDetails.taxable_income)}
            />
            <Textfield
                disabled
                label="Withholding Tax"
                value={formatNumber(payrollDetails.withholding_tax)}
            />
            <Textfield
                disabled
                label="Company Deductions"
                value={formatNumber(payrollDetails.total_deductions)}
            />
                {/* <Textfield
                    disabled = {!permissions.includes("perform_compensation_payroll")}
                    type="number"
                    onChange={formHandler.handleChange}
                    label="Manual Deductions"
                    name="manual_deductions"
                    value={formHandler.values.manual_deductions}
                    error={formHandler.errors.manual_deductions}
                /> */}
            <Textfield
                disabled
                label="Net Pay"
                value={formatNumber(payrollDetails.net_pay)}
            />
            <TextArea
                disabled = { payrollDetails.status == "final" || !permissions.includes("perform_compensation_payroll")}
                label="Remarks"
                onChange={formHandler.handleChange}
                name="remarks"
                value={formHandler.values.remarks ?? ""}
            />

            { (payrollDetails.status === "initial" && permissions.includes("perform_compensation_payroll")) &&
                <Button
                    loading={formHandler.isSubmitting}
                    type="submit"
                    onClick={() => {
                        formHandler.setFieldValue("save_changes", true);
                    }}
                    label="Save changes"
                />
            }
        </Card>
    );
};

export default NetPayCard;