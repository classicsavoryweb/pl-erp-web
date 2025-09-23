"use client";

import Card from "@/components/common/Card";
import Grid from "@/components/common/Grid";
import Textfield from "@/components/common/Textfield";
import { PayrollContext } from "@/context/PayrollProvider";
import { useContext } from "react";

const ContributionCard = () => {
    const { loading, payrollDetails } = useContext(PayrollContext);
    return (
        <Card
            size="medium"
            loading={loading}
        >
            <p className="font-semibold text-red-800">Contributions</p>
            <Grid cols={2}>
                <Textfield
                    disabled
                    label="EE SSS"
                    value={payrollDetails.employee_sss}
                />
                <Textfield
                    disabled
                    label="ER SSS"
                    value={payrollDetails.employer_sss}
                />
                <Textfield
                    disabled
                    label="EE Pagibig"
                    value={payrollDetails.employee_pagibig}
                />
                <Textfield
                    disabled
                    label="ER Pagibig"
                    value={payrollDetails.employer_pagibig}
                />
                <Textfield
                    disabled
                    label="EE Philhealth"
                    value={payrollDetails.employee_philhealth}
                />
                <Textfield
                    disabled
                    label="ER Philhealth"
                    value={payrollDetails.employer_philhealth}
                />
                <Textfield
                    disabled
                    label="Total Contributions"
                    value={payrollDetails.contribution_total}
                />
            </Grid>
        </Card>
    );
};

export default ContributionCard;