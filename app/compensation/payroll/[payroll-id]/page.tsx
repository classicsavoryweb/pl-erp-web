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
import PayrollDeductionTableCard from "@/components/modules/compensation/payroll/payroll-details/PayrollDeductionTableCard";
import { useFormik } from "formik";
import { PayrollContext } from "@/context/PayrollProvider";
import { AuthContext } from "@/context/AuthProvider";
import { useContext, useEffect, useState } from "react";
import confirm from "@/components/common/Confirm";
import { toast } from "react-toastify";
import { previewPayrollComputation, updatePayrollDetails } from "@/api/compensation/payroll";
import * as Yup from "yup";
import IncentivesCard from "@/components/modules/compensation/payroll/payroll-details/IncentivesCard";
import TardinessHistoryCard from "@/components/modules/compensation/payroll/payroll-details/TardinessHistoryCard";

const Page = () => {
    const params = useParams();
    const payrollId = params["payroll-id"];
    const { permissions } = useContext(AuthContext);
    const {setPayrollDetails, payrollDetails } = useContext(PayrollContext);

    useEffect(() => {
        formHandler.setValues({
            regular_days: payrollDetails.details.regular_days ?? 0,
            special_leave: payrollDetails.details.special_leave ?? 0,
            cancelled_off: payrollDetails.details.cancelled_off ?? 0,
            special_holiday: payrollDetails.details.special_holiday ?? 0,
            legal_holiday: payrollDetails.details.legal_holiday ?? 0,
            regular_overtime: payrollDetails.details.regular_overtime ?? 0,
            night_differential: payrollDetails.details.night_differential ?? 0,
            night_differential_overtime: payrollDetails.details.night_differential_overtime ?? 0,
            legal_holiday_overtime: payrollDetails.details.legal_holiday_overtime ?? 0,
            special_holiday_overtime: payrollDetails.details.special_holiday_overtime ?? 0,
            non_taxable_adjustment: payrollDetails.non_taxable_adjustment ?? 0,
            adjustment_amount: payrollDetails.details.adjustment_amount ?? 0,
            remarks: payrollDetails.remarks,
            tardiness_minutes: payrollDetails.details.tardiness_minutes ?? [],
            undertime_minutes: payrollDetails.details.undertime_minutes ?? [],
            deductions: payrollDetails.deductions ?? [],
            timekeeping_branch_id: payrollDetails.timekeeping_branch_id,
            save_changes: false
        });
    }, [payrollDetails]);

    const formHandler = useFormik({
        initialValues: {
            regular_days: payrollDetails.details.regular_days ?? 0,
            special_leave: payrollDetails.details.special_leave ?? 0,
            cancelled_off: payrollDetails.details.cancelled_off ?? 0,
            special_holiday: payrollDetails.details.special_holiday ?? 0,
            legal_holiday: payrollDetails.details.legal_holiday ?? 0,
            regular_overtime: payrollDetails.details.regular_overtime ?? 0,
            night_differential: payrollDetails.details.night_differential ?? 0,
            night_differential_overtime: payrollDetails.details.night_differential_overtime ?? 0,
            legal_holiday_overtime: payrollDetails.details.legal_holiday_overtime ?? 0,
            special_holiday_overtime: payrollDetails.details.special_holiday_overtime ?? 0,
            non_taxable_adjustment: payrollDetails.non_taxable_adjustment ?? 0,
            adjustment_amount: payrollDetails.details.adjustment_amount ?? 0,
            tardiness_minutes: payrollDetails.details.tardiness_minutes ?? [],
            undertime_minutes: payrollDetails.details.undertime_minutes ?? [],
            timekeeping_branch_id: payrollDetails.timekeeping_branch_id,
            deductions: payrollDetails.deductions ?? [],
            remarks: payrollDetails.remarks,
            save_changes: false,
        },
        validateOnChange: false,
        onSubmit: async (values) => {
            if (values.save_changes) {
                const isConfirmed = await confirm({
                    message : "Are you sure you want to save changes",
                    title: "Payroll Details"
                });

                if (isConfirmed) {
                    const resp = await previewPayrollComputation(Number(payrollId), values);

                    if (!resp.error) {
                        setPayrollDetails(resp.data);
                        toast.success("Payroll successfully updated");
                    } else {
                        toast.error(resp.data.message);
                    }
                }
            } else {
                try {
                    const resp = await previewPayrollComputation(Number(payrollId), values);

                    if (!resp.error) {
                        setPayrollDetails(resp.data);
                    } else {
                        toast.error(resp.data.message);
                    }
                } catch {
                    toast.error("Error preview computation.");
                }
            }
        }
    });

    return (
        <>
            <title>{`PR-${payrollId} | Classic Savory ERP`}</title>
            
            <div className="flex gap-x-4 w-full">
                <div className="w-8/12">
                    <EmployeeDetailCard
                        formHandler={formHandler}
                    />
                    <div className="mt-[16px]">
                        <AdditionalWorkingHours
                            formHandler={formHandler}
                        />
                    </div>
                    <Grid cols={2}>
                        <GovernmentIdentificationCard/>
                        <ContributionCard/>
                    </Grid>
                    <div className="mt-[8px]">
                        <WorkingHoursDeductionCard
                            formHandler={formHandler}
                        />
                    </div>
                    <div className="mt-[16px]">
                        <PayrollDeductionTableCard
                            formHandler={formHandler}
                        />
                    </div>

                    {/* <div className="mt-[16px]">
                        <TardinessHistoryCard/>
                    </div> */}
                    { (permissions.includes("perform_compensation_incentives")) &&
                        <div className="mt-[16px]">
                            <IncentivesCard/>
                        </div>
                    }
                </div>
                <div className="w-4/12">
                    <form onSubmit={formHandler.handleSubmit}>
                        <SalaryDetailCard
                            formHandler={formHandler}
                        />
                        <div className="mt-[16px]">
                            <NetPayCard
                                formHandler={formHandler}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Page;