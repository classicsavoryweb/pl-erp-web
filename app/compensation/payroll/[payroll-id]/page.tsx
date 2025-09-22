"use client";
import GovernmentIdentificationCard from "@/components/modules/compensation/payroll/payroll-details/GovernmentIdentificationCard";
import { useParams } from "next/navigation";
import EmployeeDetailCard from "@/components/modules/compensation/payroll/payroll-details/EmployeeDetailCard";
import SalaryDetailCard from "@/components/modules/compensation/payroll/payroll-details/SalaryDetailCard";
import AdditionalWorkingHours from "@/components/modules/compensation/payroll/payroll-details/AdditionalWorkingHours";

const Page = () => {
    const params = useParams();
    const payrollId = params["payroll-id"];

    return (
        <>
            <title>{`PR-${payrollId} | Classic Savory ERP`}</title>

            <div className="flex gap-x-5 w-11/12">
                <div className="w-8/12">
                    <EmployeeDetailCard/>

                    <div className="mt-[16px]">
                        <SalaryDetailCard/>
                    </div>

                    <div className="mt-[16px]">
                        <AdditionalWorkingHours/>
                    </div>
                </div>

                <div className="w-4/12">
                    <GovernmentIdentificationCard/>
                </div>
            </div>
        </>
    );
};

export default Page;