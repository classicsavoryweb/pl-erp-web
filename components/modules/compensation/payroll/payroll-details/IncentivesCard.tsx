"use client";

import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Grid from "@/components/common/Grid";
import TextArea from "@/components/common/TextArea";
import Textfield from "@/components/common/Textfield";
import { PayrollContext } from "@/context/PayrollProvider";
import { formatNumber } from "@/helper/amount";
import { useContext } from "react";

const IncentivesCard = ({ incentivesformHandler, showBreakdown, oldIncentiveAmount, monthShouldBeWorkDays } : { incentivesformHandler: any, showBreakdown: boolean,  oldIncentiveAmount: number, monthShouldBeWorkDays: number }) => {
    const { loading, incentivesDetails } = useContext(PayrollContext);
    
    const amountDeductedByPercentage = (oldIncentiveAmount + Number(incentivesDetails.additional_incentive)) * (Number(incentivesDetails.adjustment_percent) / 100);
    const amountDeductedByDays = ((oldIncentiveAmount + Number(incentivesDetails.additional_incentive)) / Number(monthShouldBeWorkDays)) * Number(incentivesDetails.adjustment_days);

    return (
        <Card
            size="small"
            loading={loading}
        >
            <p className="font-semibold text-red-800">Incentives</p>
            <Grid cols={4}>
                <Textfield
                    disabled
                    label="Incentive Amount"
                    value={formatNumber(incentivesDetails.incentive_amount)}
                />
                <Textfield
                    type="number"
                    name="adjustment_days"
                    onChange={incentivesformHandler.handleChange}
                    label="Days"
                    value={incentivesformHandler.values.adjustment_days}
                    error={incentivesformHandler.errors.adjustment_days}
                />
                <Textfield
                    type="number"
                    name="additional_incentive"
                    onChange={incentivesformHandler.handleChange}
                    label="Additional Incentive"
                    value={incentivesformHandler.values.additional_incentive}
                    error={incentivesformHandler.errors.additional_incentive}
                />
                <Textfield
                    type="number"
                    name="adjustment_percent"
                    onChange={incentivesformHandler.handleChange}
                    label="Adjustment Percent"
                    value={incentivesformHandler.values.adjustment_percent}
                    error={incentivesformHandler.errors.adjustment_percent}
                />
                <div className="col-span-2">
                    <TextArea
                        label="Remarks"
                        onChange={incentivesformHandler.handleChange}
                        name="remarks"
                        value={incentivesformHandler.values.remarks ?? ""}
                    />
                </div>
                {showBreakdown && (
                    <div className="col-span-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-1">
                            <Textfield
                                disabled
                                type="number"
                                label="Days"
                                value={incentivesDetails.adjustment_days ?? 0}
                            />
                           <Textfield
                                disabled
                                type="number"
                                label="Adjustment Percent"
                                value={incentivesDetails.adjustment_percent}
                            />
                            </div>
                            <div className="col-span-1">
                             <Textfield
                                disabled
                                label="Amount"
                                value={formatNumber(amountDeductedByDays)}
                            />
                            <Textfield
                                disabled
                                label="Amount"
                                value={formatNumber(amountDeductedByPercentage)}
                            />
                            </div>
                        </div>
                    </div>
                )}
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
        </Card>
    );
};

export default IncentivesCard;