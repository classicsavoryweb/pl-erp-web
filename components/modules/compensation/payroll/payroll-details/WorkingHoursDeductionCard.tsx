"use client";

import Card from "@/components/common/Card";
import Grid from "@/components/common/Grid";
import Textfield from "@/components/common/Textfield";
import { PayrollContext } from "@/context/PayrollProvider";
import moment from "moment";
import { useContext } from "react";

const WorkingHoursDeductionCard = () => {
    const { loading, payrollDetails } = useContext(PayrollContext);
    return (
        <Card
            size="small"
            loading={loading}
        >
            <p className="font-semibold text-red-800">Working Hours Deductions</p>

            { (payrollDetails.tardiness_list && payrollDetails.tardiness_list.length > 0) &&
                <>
                    <p className="mt-3">Tardiness</p>
                    <Grid cols={3}>
                        { payrollDetails.tardiness_list.map((tardy, idx) => {
                            return (
                                <Textfield
                                    key={idx}
                                    disabled
                                    label={moment(tardy.date).format("MMMM DD, Y")}
                                    value={tardy.tardiness + " mins - " + tardy.payment.tardiness_deduction}
                                />
                            );
                        })}
                    </Grid>
                </>
            }

            { (payrollDetails.undertime_list && payrollDetails.undertime_list.length > 0) &&
                <>
                    <p className="mt-3">Undertime</p>
                    <Grid cols={3}>
                        { payrollDetails.undertime_list.map((undertime,idx) => {
                            return (
                                <Textfield
                                    key={idx}
                                    disabled
                                    label={moment(undertime.date).format("MMMM d, Y")}
                                    value={undertime.undertime + " mins - " + undertime.payment.undertime_deduction}
                                />
                            );
                        })}
                    </Grid>
                </>
            }
        </Card>
    );
};

export default WorkingHoursDeductionCard;