"use client";

import Card from "@/components/common/Card";
import Grid from "@/components/common/Grid";
import Textfield from "@/components/common/Textfield";
import { PayrollContext } from "@/context/PayrollProvider";
import { useContext } from "react";

const OtherAdjustmentsCard = () => {
    const { loading, payrollDetails } = useContext(PayrollContext);
    return (
        <Card
            size="small"
            loading={loading}
        >
            <p className="font-semibold text-red-800 dark:text-red-500">Other Adjustments</p>
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
                <Textfield
                    disabled
                    label="Overtime Regular"
                    value={payrollDetails.overtime_amount}
                />
                <Textfield
                    disabled
                    label="Legal Holiday Overtime"
                    value={payrollDetails.legal_holiday_overtime_amount}
                />
                <Textfield
                    disabled
                    label="Night Differential"
                    value={payrollDetails.night_differential_amount}
                />
                <Textfield
                    disabled
                    label="Special Holiday Overtime"
                    value={payrollDetails.special_holiday_overtime_amount}
                />
                <Textfield
                    disabled
                    label="Night Differential Overtime"
                    value={payrollDetails.night_differential_overtime_amount}
                />
            </Grid>
        </Card>
    );
};

export default OtherAdjustmentsCard;