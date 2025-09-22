"use client";

import Card from "@/components/common/Card";
import Grid from "@/components/common/Grid";
import Textfield from "@/components/common/Textfield";
import { PayrollContext } from "@/context/PayrollProvider";
import { useContext } from "react";

const WorkingHoursDeductionCard = () => {
    const { loading, payrollDetails } = useContext(PayrollContext);
    return (
        <Card
            size="small"
            loading={loading}
        >
            <p className="font-semibold text-red-800">Working Hours Deduction</p>
            <Grid cols={2}>
                <Textfield
                    disabled
                    label="Special Holiday"
                    value={payrollDetails.special_holiday_amount}
                />
                <Textfield
                    disabled
                    label="Legal Holiday"
                    value={payrollDetails.legal_holiday_amount}
                />
            </Grid>
        </Card>
    );
};

export default WorkingHoursDeductionCard;