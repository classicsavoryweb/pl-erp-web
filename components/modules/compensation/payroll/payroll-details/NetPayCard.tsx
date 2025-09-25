"use client";

import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import TextArea from "@/components/common/TextArea";
import Textfield from "@/components/common/Textfield";
import { AuthContext } from "@/context/AuthProvider";
import { PayrollContext } from "@/context/PayrollProvider";
import { useContext } from "react";

const NetPayCard = ({ formHandler } : { formHandler: any }) => {
    const { loading, payrollDetails } = useContext(PayrollContext);
    const { permissions } = useContext(AuthContext);

    return (
        <Card
            size="medium"
            loading={loading}
        >
            <p className="font-semibold text-red-800">Salary</p>
            <Textfield
                disabled
                label="Gross Salary"
                value={payrollDetails.salary}
            />
            <Textfield
                disabled
                label="Additional Working Hours Pay"
                value={payrollDetails.additional_working_hours_total}
            />
            <Textfield
                disabled
                label="Working Hours Deductions"
                value={payrollDetails.working_hours_deduction_total}
            />
            <Textfield
                disabled
                label="Gross Pay"
                value={payrollDetails.gross_pay}
            />
            <Textfield
                disabled
                label="Contributions"
                value={payrollDetails.contribution_total}
            />
            <Textfield
                disabled
                label="Taxable Income"
                value={payrollDetails.taxable_income}
            />
            <Textfield
                disabled
                label="Withholding Tax"
                value={payrollDetails.withholding_tax}
            />
            <Textfield
                disabled
                label="Company Deductions"
                value={payrollDetails.total_deductions}
            />
            <Textfield
                disabled = {!permissions.includes("perform_compensation_payroll")}
                type="number"
                onChange={formHandler.handleChange}
                label="Manual Deductions"
                name="manual_deductions"
                value={formHandler.values.manual_deductions}
                error={formHandler.errors.manual_deductions}
            />
            <Textfield
                disabled
                label="Net Pay"
                value={payrollDetails.net_pay}
            />
            <TextArea
                disabled = {!permissions.includes("perform_compensation_payroll")}
                label="Remarks"
                onChange={formHandler.handleChange}
                name="remarks"
                value={formHandler.values.remarks ?? ""}
            />

            { permissions.includes("perform_compensation_payroll") &&
                <Button
                    type="submit"
                    onClick={() => {}}
                    label="Save changes"
                />
            }
        </Card>
    );
};

export default NetPayCard;