"use client";

import Card from "@/components/common/Card";
import Grid from "@/components/common/Grid";
import Textfield from "@/components/common/Textfield";
import { PayrollContext } from "@/context/PayrollProvider";
import { formatNumber } from "@/helper/amount";
import { useContext } from "react";

const AdditionalWorkingHours = ({ formHandler } : { formHandler: any }) => {
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
                        name="special_holiday"
                        onChange={formHandler.handleChange}
                        value={formHandler.values.special_holiday}
                        type="number"
                        disabled={payrollDetails.status == "final"}
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
                        name="legal_holiday"
                        disabled={payrollDetails.status == "final"}
                        onChange={formHandler.handleChange}
                        value={formHandler.values.legal_holiday}
                        type="number"
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
                        name="regular_overtime"
                        disabled={payrollDetails.status == "final"}
                        onChange={formHandler.handleChange}
                        value={formHandler.values.regular_overtime}
                        type="number"
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
                        label="Legal Holiday OT"
                        name="legal_holiday_overtime"
                        disabled={payrollDetails.status == "final"}
                        onChange={formHandler.handleChange}
                        value={formHandler.values.legal_holiday_overtime}
                        type="number"
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
                        name="night_differential"
                        disabled={payrollDetails.status == "final"}
                        onChange={formHandler.handleChange}
                        value={formHandler.values.night_differential}
                        type="number"
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
                        name="special_holiday_overtime"
                        disabled={payrollDetails.status == "final"}
                        onChange={formHandler.handleChange}
                        value={formHandler.values.special_holiday_overtime}
                        type="number"
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
                        name="night_differential_overtime"
                        onChange={formHandler.handleChange}
                        disabled={payrollDetails.status == "final"}
                        value={formHandler.values.night_differential_overtime}
                        type="number"
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
                        name="cancelled_off"
                        disabled={payrollDetails.status == "final"}
                        onChange={formHandler.handleChange}
                        value={formHandler.values.cancelled_off}
                        type="number"
                    />
                    <Textfield
                        disabled
                        label="Amount"
                        value={formatNumber(payrollDetails.cancelled_off)}
                    />
                </Grid>
                <Grid
                    cols={2}
                    smallGap
                >
                    <Textfield
                        label="Cancelled Off Overtime"
                        name="cancelled_off_overtime"
                        onChange={formHandler.handleChange}
                        value={formHandler.values.cancelled_off_overtime}
                        type="number"
                        disabled={payrollDetails.status == "final"}
                    />
                    <Textfield
                        disabled
                        label="Amount"
                        value={formatNumber(payrollDetails.cancelled_off_overtime_amount)}
                    />
                </Grid>
            </Grid>
        </Card>
    );
};

export default AdditionalWorkingHours;