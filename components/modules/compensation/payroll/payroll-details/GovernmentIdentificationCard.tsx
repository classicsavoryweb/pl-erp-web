"use client";

import Card from "@/components/common/Card";
import Textfield from "@/components/common/Textfield";
import { PayrollContext } from "@/context/PayrollProvider";
import { useContext } from "react";

const GovernmentIdentificationCard = () => {
    const { loading, payrollDetails } = useContext(PayrollContext);
    return (
        <Card
            size="medium"
            loading={loading}
        >
            <p className="font-semibold text-blue-950 dark:text-blue-500">Government Identification</p>
            <Textfield
                disabled
                label="SSS"
                value={payrollDetails.employee.sss ?? ""}
            />
            <Textfield
                disabled
                label="Pagibig"
                value={payrollDetails.employee.pagibig ?? ""}
            />
            <Textfield
                disabled
                label="Philhealth"
                value={payrollDetails.employee.philhealth ?? ""}
            />
            <Textfield
                disabled
                label="TIN"
                value={payrollDetails.employee.tin ?? ""}
            />
        </Card>
    );
};

export default GovernmentIdentificationCard;