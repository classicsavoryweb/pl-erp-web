"use client";
import GovernmentIdentificationCard from "@/components/modules/compensation/payroll/payroll-details/GovernmentIdentificationCard";
import { useParams } from "next/navigation";
import EmployeeDetailCard from "@/components/modules/compensation/payroll/payroll-details/EmployeeDetailCard";
import SalaryDetailCard from "@/components/modules/compensation/payroll/payroll-details/SalaryDetailCard";
import AdditionalWorkingHours from "@/components/modules/compensation/payroll/payroll-details/AdditionalWorkingHours";
import WorkingHoursDeductionCard from "@/components/modules/compensation/payroll/payroll-details/WorkingHoursDeductionCard";
import ContributionCard from "@/components/modules/compensation/payroll/payroll-details/ContributionCard";
import NetPayCard from "@/components/modules/compensation/payroll/payroll-details/NetPayCard";
import Grid from "@/components/common/Grid";

const Page = () => {
    const params = useParams();
    const payrollId = params["payroll-id"];

    return (
        <>
            <title>{`PR-${payrollId} | Classic Savory ERP`}</title>

            <div className="flex gap-x-5 w-full">
                <div className="w-8/12">
                    <EmployeeDetailCard/>
                    <div className="mt-[16px]">
                        <AdditionalWorkingHours/>
                    </div>
                    <Grid cols={2}>
                        <GovernmentIdentificationCard/>
                        <ContributionCard/>
                    </Grid>
                    <div className="mt-[8px]">
                        <WorkingHoursDeductionCard/>
                    </div>
                </div>

                <div className="w-4/12">
                    <SalaryDetailCard/>
                    <div className="mt-[16px]">
                        <NetPayCard/>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Page;