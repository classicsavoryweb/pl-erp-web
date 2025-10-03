"use client";

import Card from "@/components/common/Card";
import Grid from "@/components/common/Grid";
import Textfield from "@/components/common/Textfield";
import { PayrollContext } from "@/context/PayrollProvider";
import { useContext } from "react";

const IncentivesCard = () => {
    const { loading, payrollDetails } = useContext(PayrollContext);
    return (
        <Card
            size="small"
            loading={loading}
        >
            <p className="font-semibold text-red-800">Incentives</p>
            <Grid cols={3}>
                <Textfield
                    disabled
                    type="number"
                    label="Incentive Amount"
                    value={payrollDetails.incentives.incentive_amount}
                />
                <Textfield
                    disabled
                    type="number"
                    label="Additional Incentive"
                    value={payrollDetails.incentives.additional_incentive}
                />
                <Textfield
                    disabled
                    type="number"
                    label="Adjustment Days"
                    value={payrollDetails.incentives.adjustment_days}
                />
                <Textfield
                    disabled
                    type="number"
                    label="Adjustment Percent"
                    value={payrollDetails.incentives.adjustment_percent}
                />
            </Grid>
        </Card>
    );
};

export default IncentivesCard;