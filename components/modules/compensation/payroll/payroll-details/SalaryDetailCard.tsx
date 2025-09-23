"use client";

import Card from "@/components/common/Card";
import Grid from "@/components/common/Grid";
import Textfield from "@/components/common/Textfield";
import { PayrollContext } from "@/context/PayrollProvider";
import moment from "moment";
import { useContext } from "react";

const SalaryDetailCard = () => {
    const { loading, payrollDetails } = useContext(PayrollContext);
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
                    label="Taxable Adjustments"
                    value={payrollDetails.timekeeping_summary.adjustment_amount}
                />
                <Textfield
                    disabled
                    label="Non-taxable Adjustments"
                    value={payrollDetails.non_taxable_adjustment}
                />
            </Grid>
        </Card>
    );
};

export default SalaryDetailCard;