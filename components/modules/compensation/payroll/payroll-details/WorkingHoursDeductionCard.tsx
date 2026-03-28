"use client";

import Card from "@/components/common/Card";
import Grid from "@/components/common/Grid";
import Textfield from "@/components/common/Textfield";
import { PayrollContext } from "@/context/PayrollProvider";
import { formatNumber } from "@/helper/amount";
import moment from "moment";
import { useContext } from "react";

const WorkingHoursDeductionCard = ({ formHandler } : { formHandler: any }) => {
    const { loading, payrollDetails } = useContext(PayrollContext);
    return (
        <Card
            size="small"
            loading={loading}
        >
            <p className="font-semibold text-red-800 dark:text-red-500">Working Hours Deductions</p>

            <p className="mt-3">Tardiness</p>
            { (formHandler.values.tardiness_minutes && formHandler.values.tardiness_minutes.length > 0) &&
                <>
                    <Grid cols={3}>
                        { formHandler.values.tardiness_minutes.map((tardy: any, idx:number) => {
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
            <p className="mt-3">Undertime</p>
            { (formHandler.values.undertime_minutes && formHandler.values.undertime_minutes.length > 0) &&
                <>
                    <Grid cols={3}>
                        { formHandler.values.undertime_minutes.map((undertime: any, idx: number) => {
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