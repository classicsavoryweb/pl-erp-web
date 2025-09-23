"use client";

import Card from "@/components/common/Card";
import TextArea from "@/components/common/TextArea";
import Textfield from "@/components/common/Textfield";
import { PayrollContext } from "@/context/PayrollProvider";
import { useContext } from "react";

const NetPayCard = () => {
    const { loading, payrollDetails } = useContext(PayrollContext);
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
                label="Working Hours Deduction"
                value={payrollDetails.working_hours_deduction_total}
            />
            <Textfield
                disabled
                label="Contributions"
                value={payrollDetails.contribution_total}
            />
            <Textfield
                disabled
                label="Gross Pay"
                value={payrollDetails.gross_pay}
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
                disabled
                label="Net Pay"
                value={payrollDetails.net_pay}
            />
            <TextArea
                disabled
                label="Remarks"
                value={payrollDetails.remarks ?? ""}
            />
        </Card>
    );
};

export default NetPayCard;