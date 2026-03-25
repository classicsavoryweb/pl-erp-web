"use client";

import Card from "@/components/common/Card";
import Grid from "@/components/common/Grid";
import Textfield from "@/components/common/Textfield";
import { PayrollContext } from "@/context/PayrollProvider";
import { formatNumber } from "@/helper/amount";
import moment from "moment";
import { useContext } from "react";

const WorkingHoursDeductionCard = () => {
    const { loading, payrollDetails } = useContext(PayrollContext);
    return (
        <Card
            size="small"
            loading={loading}
        >
            <p className="font-semibold text-red-800 dark:text-red-500">Working Hours Deductions</p>

            { (payrollDetails.details.tardiness_minutes && payrollDetails.details.tardiness_minutes.length > 0) &&
                <>
                    <p className="mt-3">Tardiness</p>
                    <Grid cols={3}>
                        { payrollDetails.details?.tardiness_minutes.map((tardy, idx) => {
                            return (
                                <Grid
                                    cols={2}
                                    key={idx}
                                    smallGap
                                >
                                    <Textfield
                                        disabled
                                        label={moment(tardy.date).format("MMMM DD, Y")}
                                        value={tardy.minutes + " mins"}
                                    />
                                    <Textfield
                                        disabled
                                        label={"Amount"}
                                        value={formatNumber( Number(tardy.minutes) * (Number(payrollDetails.hourly_rate ?? 0) / 60))}
                                    />
                                </Grid>
                            );
                        })}
                    </Grid>
                </>
            }

            { (payrollDetails.details.undertime_minutes && payrollDetails.details.undertime_minutes.length > 0) &&
                <>
                    <p className="mt-3">Undertime</p>
                    <Grid cols={3}>
                        { payrollDetails.details.undertime_minutes.map((undertime,idx) => {
                            return (
                                <Grid
                                    cols={2}
                                    key={idx}
                                    smallGap
                                >
                                    <Textfield
                                        disabled
                                        label={moment(undertime.date).format("MMMM d, Y")}
                                        value={undertime.minutes + "mins"}
                                    />
                                    <Textfield
                                        disabled
                                        label={"Amount"}
                                        value={formatNumber(Number(undertime.minutes) * (Number(payrollDetails.hourly_rate ?? 0) / 60))}
                                    />
                                </Grid>
                            );
                        })}
                    </Grid>
                </>
            }
        </Card>
    );
};

export default WorkingHoursDeductionCard;