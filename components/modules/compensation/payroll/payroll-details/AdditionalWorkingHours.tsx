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
            <p className="font-semibold text-red-800 dark:text-red-500">Additional Working Hours</p>
            <Grid cols={3}>
                <Grid
                    cols={2}
                    smallGap
                >
                    <Textfield
                        label="Special Holiday"
                        value={payrollDetails?.details?.special_holiday ?? 0}
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
                        label="Legal Holiday"
                        value={payrollDetails?.details?.legal_holiday ?? 0}
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
                        label="Overtime Regular"
                        value={payrollDetails?.details?.regular_overtime ?? 0}
                    />
                    <Textfield
                        label="Amount"
                        value={formatNumber(payrollDetails.overtime_amount)}
                    />
                </Grid>

                <Grid
                    cols={2}
                    smallGap
                >
                    <Textfield
                        label="Legal Holiday OT"
                        value={payrollDetails?.details?.legal_holiday_overtime ?? 0}
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
                        label="Night Differential"
                        value={payrollDetails?.details?.night_differential ?? 0}
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
                        label="Special Holiday OT"
                        value={payrollDetails?.details?.special_holiday_overtime ?? 0}
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
                        label="Night Differential OT"
                        value={payrollDetails?.details?.night_differential_overtime ?? 0}
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
                        label="Cancelled Off"
                        value={payrollDetails?.details?.cancelled_off ?? 0}
                    />
                    <Textfield
                        label="Amount"
                        value={formatNumber(payrollDetails.cancelled_off)}
                    />
                </Grid>
            </Grid>
        </Card>
    );
};

export default AdditionalWorkingHours;