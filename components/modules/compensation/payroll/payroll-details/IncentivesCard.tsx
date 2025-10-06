"use client";

import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Grid from "@/components/common/Grid";
import Textfield from "@/components/common/Textfield";
import { AuthContext } from "@/context/AuthProvider";
import { PayrollContext } from "@/context/PayrollProvider";
import { formatNumber } from "@/helper/amount";
import { useContext } from "react";

const IncentivesCard = ({ incentivesformHandler } : { incentivesformHandler: any }) => {
    const { loading, incentivesDetails } = useContext(PayrollContext);
    const { permissions } = useContext(AuthContext);
    
    return (
        <Card
            size="small"
            loading={loading}
        >
            <p className="font-semibold text-red-800">Incentives</p>
            <Grid cols={3}>
                <Textfield
                    disabled
                    label="Incentive Amount"
                    value={formatNumber(incentivesDetails.incentive_amount)}
                />
                <Textfield
                    disabled
                    type="number"
                    label="Days"
                    value={incentivesDetails.adjustment_days}
                />
                <Textfield
                    disabled
                    type="number"
                    label="Additional Incentive"
                    value={incentivesDetails.additional_incentive}
                />
                <Textfield
                    type="number"
                    disabled = {!permissions.includes("perform_compensation_incentives")}
                    name="adjustment_percent"
                    onChange={incentivesformHandler.handleChange}
                    label="Adjustment Percent"
                    value={incentivesformHandler.values.adjustment_percent}
                    error={incentivesformHandler.errors.adjustment_percent}
                />
            </Grid>
            <Grid cols={3}>
                <div />
                <div />
                { (permissions.includes("perform_compensation_incentives")) &&
                    <div className="justify-end">
                        <Button
                            type="submit"
                            onClick={() => {}}
                            label="Save changes"
                        />
                    </div>
                }
            </Grid>
        </Card>
    );
};

export default IncentivesCard;