"use client";

import EditEmployeeFormCard from "@/components/modules/employees/edit-form/EditEmployeeFormCard";
import { useParams } from "next/navigation";

const Page = () => {

    const params = useParams();
    const employeeNumber = params["employee-number"];

    return (
        <>
            <title>{`${employeeNumber} | Classic Savory ERP`}</title>
            <EditEmployeeFormCard/>
        </>
    );
};

export default Page;