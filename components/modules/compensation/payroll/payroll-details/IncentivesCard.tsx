"use client";

import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Grid from "@/components/common/Grid";
import TextArea from "@/components/common/TextArea";
import Textfield from "@/components/common/Textfield";
import { PayrollContext } from "@/context/PayrollProvider";
import { formatNumber } from "@/helper/amount";
import { toast } from "react-toastify";
import confirm from "@/components/common/Confirm";
import { updatePayrollIncentive } from "@/api/compensation/payroll";
import { FormikErrors, useFormik } from "formik";
import { useContext, useEffect, useState } from "react";

const IncentivesCard = () => {

    const { setIncentivesDetails, loading , incentivesDetails } = useContext(PayrollContext);
    const { payrollDetails } = useContext(PayrollContext);
    const [monthShouldBeWorkDays, setMonthShouldBeWorkDays] = useState(0);
    const oldAdjustmentDays = incentivesDetails.adjustment_days;
    const oldAdjustmentPercent = incentivesDetails.adjustment_percent;

    useEffect(() => {
        incentivesformHandler.setValues({
            adjustment_days: oldAdjustmentDays,
            adjustment_percent: oldAdjustmentPercent,
            additional_incentive: incentivesDetails.additional_incentive,
            remarks: incentivesDetails.remarks,
        });
        setMonthShouldBeWorkDays(incentivesDetails.days);
    }, [incentivesDetails, oldAdjustmentDays, oldAdjustmentPercent]);
    
    const amountDeductedByPercentage = 
        (Number(incentivesDetails.amount_rate)) 
        * (Number(incentivesDetails.adjustment_percent) / 100);
    
    const amountDeductedByDays = 
        ((Number(incentivesDetails.amount_rate)) 
        / Number(monthShouldBeWorkDays)) 
        * Number(incentivesDetails.adjustment_days);

    interface IncentiveFormValues {
        adjustment_days: number;
        adjustment_percent: number;
        additional_incentive: number;
        remarks: string;
    }

    const incentivesformHandler = useFormik<IncentiveFormValues>({
        initialValues: {
            adjustment_days: incentivesDetails.adjustment_days,
            adjustment_percent: incentivesDetails.adjustment_percent,
            additional_incentive: incentivesDetails.additional_incentive,
            remarks: incentivesDetails.remarks
        },
        validateOnChange: false,
        validate: (values: IncentiveFormValues) => {
            const errors: FormikErrors<IncentiveFormValues> = {};

            if (values.additional_incentive < 0) {
                errors.additional_incentive = "Negative value is not allowed";
            }

            if (values.additional_incentive > 0 && !values.remarks) {
                errors.remarks = "Remarks is required for additional incentive";
            }

            return errors;
        },
        onSubmit: async (values) => {
            const isConfirmed = await confirm({
                message : "Are you sure you want to save changes",
                title: "Incentives"
            });

            if (isConfirmed) {
                updatePayrollIncentive(payrollDetails.id, values)
                .then((resp) => {
                    if (!resp.error) {
                        toast.success(resp.data.message);
                        setIncentivesDetails({ 
                            ...resp.data.incentives, 
                            days: resp.data.days,
                            worked_days: resp.data.worked_days
                        });
                        setMonthShouldBeWorkDays(resp.data.days);
                    } else {
                        toast.error(resp.data.message);
                    }
                }).catch(() => {
                    toast.error("Error encountered");
                });
            }
        }
    });

    return (
        <Card
            size="small"
            loading={loading}
        >
            <form onSubmit={incentivesformHandler.handleSubmit}>
                <p className="font-semibold text-red-800">Incentives</p>
                <Grid cols={4}>
                    <div className="col-span-2">
                        <Grid cols={2}>
                            <Textfield
                                disabled
                                label="Monthly Incentive Amount"
                                value={formatNumber(incentivesDetails.amount_rate)}
                            />
                            <div className="col-span-1">
                                <Textfield
                                    type="number"
                                    name="additional_incentive"
                                    onChange={incentivesformHandler.handleChange}
                                    label="Additional Incentive"
                                    value={incentivesformHandler.values.additional_incentive}
                                    error={incentivesformHandler.errors.additional_incentive}
                                />
                            </div>
                            <Textfield
                                type="text"
                                name="adjustment_percent"
                                label="Tardiness Deduction Percent"
                                disabled
                                value={`${incentivesformHandler.values.adjustment_percent}%`}
                                error={incentivesformHandler.errors.adjustment_percent}
                            />
                            <Textfield
                                disabled
                                label="Amount"
                                value={formatNumber(amountDeductedByPercentage)}
                            />
                            <Textfield
                                type="number"
                                name="adjustment_days"
                                onChange={incentivesformHandler.handleChange}
                                label="Absent Days"
                                disabled
                                value={incentivesformHandler.values.adjustment_days}
                                error={incentivesformHandler.errors.adjustment_days}
                            />
                            <Textfield
                                disabled
                                label="Amount"
                                value={formatNumber(amountDeductedByDays)}
                            />
                        </Grid>
                    </div>
                    <div className="col-span-2">
                        <div className="grid grid-cols-2 gap-x-4">
                            <Textfield
                                disabled
                                label="Worked Days"
                                value={incentivesDetails.worked_days}
                            />
                            <div className="col-span-1">
                                <Textfield
                                    disabled
                                    label="Final Incentive Amount"
                                    name ="incentive_amount"
                                    value={formatNumber(incentivesDetails.incentive_amount)}
                                />
                            </div>
                            <div className="col-span-2 gap-x-4">
                                <TextArea
                                    label="Remarks"
                                    onChange={incentivesformHandler.handleChange}
                                    name="remarks"
                                    value={incentivesformHandler.values.remarks ?? ""}
                                    error={incentivesformHandler.errors.remarks}
                                />
                            </div>
                        </div>
                    </div>
                </Grid>
                <Grid cols={3}>
                    <div />
                    <div />
                    <div className="justify-end">
                        <Button
                            type="submit"
                            onClick={() => {}}
                            label="Save changes"
                        />
                    </div>
                </Grid>
            </form>
        </Card>
    );
};

export default IncentivesCard;