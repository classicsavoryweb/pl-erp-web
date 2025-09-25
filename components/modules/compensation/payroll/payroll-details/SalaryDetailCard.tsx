"use client";

import Card from "@/components/common/Card";
import Grid from "@/components/common/Grid";
import Textfield from "@/components/common/Textfield";
import { AuthContext } from "@/context/AuthProvider";
import { PayrollContext } from "@/context/PayrollProvider";
import moment from "moment";
import { useContext } from "react";

const SalaryDetailCard = ({ formHandler } : { formHandler: any }) => {
    const { loading, payrollDetails } = useContext(PayrollContext);
    const { permissions } = useContext(AuthContext);

    return (
        <Card
            size="small"
            loading={loading}
        >
            <p className="font-semibold text-red-800">Salary Details</p>
            <Grid cols={2}>
                <Textfield
                    disabled
                    label="Cutoff"
                    value={moment(payrollDetails.start_date).format("MMM. DD") + " to " +moment(payrollDetails.end_date).format("MMM. DD, YYYY")}
                />
                <Textfield
                    disabled
                    label="Pay Date"
                    value={payrollDetails.pay_date}
                />
                <Textfield
                    disabled
                    label="Regular Days"
                    value={payrollDetails.timekeeping_summary.regular_days}
                />
                <Textfield
                    disabled
                    label="Daily Rate"
                    value={payrollDetails.daily_rate}
                />
                <Textfield
                    disabled
                    label="Hourly Rate"
                    value={payrollDetails.hourly_rate}
                />
                <Textfield
                    disabled
                    label="Salary"
                    value={payrollDetails.salary}
                />
            </Grid>

            <p className="font-semibold text-red-800 mt-3">Other Adjustments</p>
            <Grid cols={2}>
                <Textfield
                    disabled
                    label="Taxable Adjustment"
                    value={payrollDetails.timekeeping_summary.adjustment_amount}
                />
                <Textfield
                    disabled = {!permissions.includes("perform_compensation_payroll")}
                    label="Non-taxable Adjustment"
                    name="non_taxable_adjustment"
                    type="number"
                    onChange={formHandler.handleChange}
                    value={formHandler.values.non_taxable_adjustment}
                    error={formHandler.errors.non_taxable_adjustment}
                />
            </Grid>
        </Card>
    );
};

export default SalaryDetailCard;