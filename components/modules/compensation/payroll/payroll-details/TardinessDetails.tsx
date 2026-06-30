"use client";

import { getEmployeeMonthlyTardiness } from "@/api/compensation/payroll";
import Accordion from "@/components/common/Accordion";
import Card from "@/components/common/Card";
import Grid from "@/components/common/Grid";
import Textfield from "@/components/common/Textfield";
import { AuthContext } from "@/context/AuthProvider";
import { PayrollContext } from "@/context/PayrollProvider";
import { formatNumber } from "@/helper/amount";
import { useAsyncEffect } from "@/hooks/async-effect";
import moment from "moment";
import { useContext, useState } from "react";

const TardinessDetails = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const {payrollDetails} = useContext(PayrollContext);
    const [tardinessArray, setTardinessArray] = useState<number[]>([0, 0]);

    useAsyncEffect(() => {
        getEmployeeMonthlyTardiness(payrollDetails.employee.employee_number, {
            date: payrollDetails.pay_date
        }).then((resp) => {
            if (!resp.error) {
                setTardinessArray(resp.data);
            }
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    return (
        <Card
            size="small"
            loading={loading}
        >
            <p className="font-semibold text-red-800 dark:text-red-500">Tardiness Details</p>

            <Grid cols={3}>
                <Textfield
                    label="Past Cutoff"
                    disabled
                    value={tardinessArray[0] ?? 0}
                />
                <Textfield
                    label="Current Cutoff"
                    disabled
                    value={tardinessArray[1] ?? 0}
                />
                <Textfield
                    label="Total"
                    disabled
                    value={Number(tardinessArray[0] ?? 0) + Number(tardinessArray[1] ?? 0)}
                />
            </Grid>
        </Card>
    );
};

export default TardinessDetails;