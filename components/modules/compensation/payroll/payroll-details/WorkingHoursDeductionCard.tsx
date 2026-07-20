"use client";

import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Grid from "@/components/common/Grid";
import Textfield from "@/components/common/Textfield";
import { PayrollContext } from "@/context/PayrollProvider";
import { formatNumber } from "@/helper/amount";
import moment from "moment";
import { useContext, useEffect, useRef, useState } from "react";
import AddDateDeductionHoursModal from "./AddDateDeductionHoursModal";
import { useModal } from "@/hooks/modal";

const WorkingHoursDeductionCard = ({ formHandler } : { formHandler: any }) => {
    const { loading, payrollDetails } = useContext(PayrollContext);
    const modal = useModal();
    const [toggle, setToggle] = useState<boolean>(false);
    const [type, setType] = useState<"tardiness" | "undertime">("tardiness");

    useEffect(() => {
        if (toggle) {
            const delayDebounce = setTimeout(() => {
                formHandler.setFieldValue("save_changes", false);
                formHandler.setFieldValue("reload_deductions", false);
                formHandler.submitForm();
            }, 750);
    
            return () => clearTimeout(delayDebounce);
        }
    }, [
        toggle,
        formHandler.values.tardiness_minutes.length,
        formHandler.values.undertime_minutes.length,
    ]);

    return (
        <>
        <Card
            size="small"
            loading={loading}
        >
            <p className="font-semibold text-red-800 dark:text-red-500">Working Hours Deductions</p>
            <div className="flex justify-between items-center">
                <p className="mt-3">Tardiness</p>
                { payrollDetails.status == "initial" &&
                    <div>
                        <Button
                            type="button"
                            label="Add"
                            onClick={() => {
                                modal.onOpen();
                                setType("tardiness");
                            }}
                        />
                    </div>
                }
            </div>

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
                                        disabled={payrollDetails.status == "final"}
                                        label={moment(tardy.date).format("MMMM DD, Y")}
                                        value={tardy.minutes}
                                        type="number"
                                        onChange={(e) => {
                                            const minutes:any = [...formHandler.values.tardiness_minutes];
                                            minutes[idx] = {
                                                ...minutes[idx],
                                                minutes: e.target.value
                                            };
                                            formHandler.setFieldValue("tardiness_minutes", minutes);
                                        }}
                                    />
                                    <div>
                                        { payrollDetails.status == "initial" &&
                                            <div className="flex justify-end">
                                                <p
                                                    className="z-1 mb-[-30px] hover:text-red-800 dark:text-red-500 hover:cursor-pointer"
                                                    onClick={() => {
                                                        const minutes = [...formHandler.values.tardiness_minutes];
                                                        minutes.splice(idx, 1)
                                                        formHandler.setFieldValue("tardiness_minutes", minutes);
                                                        setToggle(true);
                                                    }}
                                                >
                                                    Remove
                                                </p>
                                            </div>
                                        }
                                        <Textfield
                                            disabled
                                            label={"Amount"}
                                            value={formatNumber(Number(tardy.minutes) * Number(payrollDetails.details.minute_rate ?? 0))}
                                        />
                                    </div>
                                </Grid>
                            );
                        })}
                    </Grid>
                    <Grid cols={3}>
                        <Textfield
                            disabled
                            label={"Total Tardiness"}
                            value={
                                formHandler.values.tardiness_minutes.reduce(
                                (sum: number, item: any) => sum + Number(item.minutes), 0)
                            }
                        />
                    </Grid>
                </>
            }

            <div className="flex justify-between items-center">
                <p>Undertime</p>
                { payrollDetails.status == "initial" &&
                    <div>
                        <Button
                            type="button"
                            label="Add"
                            onClick={() => {
                                modal.onOpen();
                                setType("undertime");
                            }}
                        />
                    </div>
                }
            </div>

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
                                        disabled={payrollDetails.status == "final"}
                                        label={moment(undertime.date).format("MMMM DD, Y")}
                                        value={undertime.minutes}
                                        type="number"
                                        onChange={(e) => {
                                            const minutes:any = [...formHandler.values.undertime_minutes];
                                            minutes[idx] = {
                                                ...minutes[idx],
                                                minutes: e.target.value
                                            };
                                            formHandler.setFieldValue("undertime_minutes", minutes);
                                        }}
                                    />

                                    <div>
                                        { payrollDetails.status == "initial" &&
                                            <div className="flex justify-end">
                                                <p
                                                    className="z-1 mb-[-30px] hover:text-red-800 dark:text-red-500 hover:cursor-pointer"
                                                    onClick={() => {
                                                        const minutes = [...formHandler.values.undertime_minutes];
                                                        minutes.splice(idx, 1)
                                                        formHandler.setFieldValue("undertime_minutes", minutes);
                                                        setToggle(true);
                                                    }}
                                                >
                                                    Remove
                                                </p>
                                            </div>
                                        }
                                        <Textfield
                                            disabled
                                            label={"Amount"}
                                            value={formatNumber(Number(undertime.minutes) * Number(payrollDetails.details.minute_rate ?? 0))}
                                        />
                                    </div>
                                </Grid>
                            );
                        })}
                    </Grid>
                    <Grid cols={3}>
                        <Textfield
                            disabled
                            label={"Total Undertime"}
                            value={
                                formHandler.values.undertime_minutes.reduce(
                                (sum: number, item: any) => sum + Number(item.minutes), 0)
                            }
                        />
                    </Grid>
                </>
            }
        </Card>
        <AddDateDeductionHoursModal
            modal={modal}
            type={type}
            payrollFormhandler={formHandler}
        />
        </>
    );
};

export default WorkingHoursDeductionCard;