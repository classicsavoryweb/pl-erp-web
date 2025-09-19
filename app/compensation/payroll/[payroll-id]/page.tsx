"use client";
import { useParams } from "next/navigation";

const Page = () => {
    const params = useParams();
    const payrollId = params["payroll-id"];

    return (
        <>
            <title>{`PR-${payrollId} | Classic Savory ERP`}</title>
        </>
    );
};

export default Page;