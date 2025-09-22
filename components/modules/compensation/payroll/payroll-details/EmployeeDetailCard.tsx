"use client";

import Card from "@/components/common/Card";
import Grid from "@/components/common/Grid";
import Textfield from "@/components/common/Textfield";
import { PayrollContext } from "@/context/PayrollProvider";
import { useContext } from "react";

const EmployeeDetailCard = () => {
    const { loading, payrollDetails } = useContext(PayrollContext);
    return (
        <Card
            size="small"
            loading={loading}
        >
            <p className="font-semibold text-red-800">Employee Details</p>
            <Grid cols={2}> 
                <Textfield
                    disabled
                    label="Employee"
                    value={payrollDetails.employee.full_name}
                />
                <Textfield
                    disabled
                    label="Employee Number"
                    value={payrollDetails.employee.employee_number}
                />
                <Textfield
                    disabled
                    label="Branch"
                    value={payrollDetails?.employee?.current_branch?.name}
                />
                <Textfield
                    disabled
                    label={payrollDetails?.employee?.latest_bank_details?.bank_account_type_id === "2" ? "Savings Account" : "Cash Card"}
                    value={payrollDetails?.employee?.latest_bank_details?.bank_number}
                />
                <Textfield
                    disabled
                    label="Payment Type"
                    value={payrollDetails.pay_type}
                />
                <Textfield
                    disabled
                    label="Tax Type"
                    value={payrollDetails.tax_status}
                />
            </Grid>
        </Card>
    );
};

export default EmployeeDetailCard;