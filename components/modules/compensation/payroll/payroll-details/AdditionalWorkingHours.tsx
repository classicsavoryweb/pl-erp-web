"use client";

import Card from "@/components/common/Card";
import Grid from "@/components/common/Grid";
import Textfield from "@/components/common/Textfield";
import { PayrollContext } from "@/context/PayrollProvider";
import { formatNumber } from "@/helper/amount";
import { useContext } from "react";

const AdditionalWorkingHours = () => {
    const { loading, payrollDetails } = useContext(PayrollContext);
    return (
        <Card
            size="small"
            loading={loading}
        >
            <p className="font-semibold text-red-800">Additional Working Hours</p>
            <Grid cols={3}>
                <Grid
                    cols={2}
                    smallGap
                >
                    <Textfield
                        disabled
                        label="Special Holiday"
                        value={payrollDetails.timekeeping_summary.special_holiday}
                    />
                    <Textfield
                        disabled
                        label="Amount"
                        value={formatNumber(payrollDetails.special_holiday_amount)}
                    />
                </Grid>

                <Grid
                    cols={2}
                    smallGap
                >
                    <Textfield
                        disabled
                        label="Legal Holiday"
                        value={payrollDetails.timekeeping_summary.legal_holiday}
                    />
                    <Textfield
                        disabled
                        label="Amount"
                        value={formatNumber(payrollDetails.legal_holiday_amount)}
                    />
                </Grid>

                <Grid
                    cols={2}
                    smallGap
                >
                    <Textfield
                        disabled
                        label="Overtime Regular"
                        value={payrollDetails.timekeeping_summary.regular_overtime}
                    />
                    <Textfield
                        disabled
                        label="Amount"
                        value={formatNumber(payrollDetails.overtime_amount)}
                    />
                </Grid>

                <Grid
                    cols={2}
                    smallGap
                >
                    <Textfield
                        disabled
                        label="Legal Holiday OT"
                        value={payrollDetails.timekeeping_summary.legal_holiday_overtime}
                    />
                    <Textfield
                        disabled
                        label="Amount"
                        value={formatNumber(payrollDetails.legal_holiday_overtime_amount)}
                    />
                </Grid>

                <Grid
                    cols={2}
                    smallGap
                >
                    <Textfield
                        disabled
                        label="Night Differential"
                        value={payrollDetails.timekeeping_summary.night_differential}
                    />
                    <Textfield
                        disabled
                        label="Amount"
                        value={formatNumber(payrollDetails.night_differential_amount)}
                    />
                </Grid>

                <Grid
                    cols={2}
                    smallGap
                >
                    <Textfield
                        disabled
                        label="Special Holiday OT"
                        value={payrollDetails.timekeeping_summary.special_holiday_overtime}
                    />
                    <Textfield
                        disabled
                        label="Amount"
                        value={formatNumber(payrollDetails.special_holiday_overtime_amount)}
                    />
                </Grid>

                <Grid
                    cols={2}
                    smallGap
                >
                    <Textfield
                        disabled
                        label="Night Differential OT"
                        value={payrollDetails.timekeeping_summary.night_differential_overtime}
                    />
                    <Textfield
                        disabled
                        label="Amount"
                        value={formatNumber(payrollDetails.night_differential_overtime_amount)}
                    />
                </Grid>

                <Grid
                    cols={2}
                    smallGap
                >
                    <Textfield
                        disabled
                        label="Cancelled Off"
                        value={payrollDetails.timekeeping_summary.cancelled_off}
                    />
                    <Textfield
                        disabled
                        label="Amount"
                        value={formatNumber(payrollDetails.cancelled_off)}
                    />
                </Grid>
            </Grid>
        </Card>
    );
};

export default AdditionalWorkingHours;