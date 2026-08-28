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
import { useContext, useEffect } from "react";
import confirm from "@/components/common/Confirm";
import { toast } from "react-toastify";
import { previewPayrollComputation } from "@/api/compensation/payroll";
import * as Yup from "yup";
import IncentivesCard from "@/components/modules/compensation/payroll/payroll-details/IncentivesCard";
import TardinessHistoryCard from "@/components/modules/compensation/payroll/payroll-details/TardinessHistoryCard";
import TardinessDetails from "@/components/modules/compensation/payroll/payroll-details/TardinessDetails";
import { canEditRestrictedRecords } from "@/helper/restriction";

const Page = () => {
    const params = useParams();
    const payrollId = params["payroll-id"];
    const { permissions } = useContext(AuthContext);
    const {setPayrollDetails, payrollDetails, cutOff } = useContext(PayrollContext);

    useEffect(() => {
        formHandler.setValues({
            regular_days: payrollDetails.details.regular_days ?? 0,
            special_leave: payrollDetails.details.special_leave ?? 0,
            cancelled_off: payrollDetails.details.cancelled_off ?? 0,
            cancelled_off_overtime: payrollDetails.details.cancelled_off_overtime ?? 0,
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
            tardiness_minutes: (payrollDetails.details.tardiness_minutes ?? []).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()),
            undertime_minutes: (payrollDetails.details.undertime_minutes ?? []).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()),
            deductions: payrollDetails.deductions ?? [],
            timekeeping_branch_id: payrollDetails.timekeeping_branch_id,
            employee_sss: payrollDetails.employee_sss,
            employer_sss: payrollDetails.employer_sss,
            employee_pagibig: payrollDetails.employee_pagibig,
            employer_pagibig: payrollDetails.employer_pagibig,
            employee_philhealth: payrollDetails.employee_philhealth,
            employer_philhealth: payrollDetails.employer_philhealth,
            withholding_tax: payrollDetails.withholding_tax,
            is_manual_statutory_entry: payrollDetails.details.is_manual_statutory_entry ?? 0,
            is_complete_documents: payrollDetails.details.is_complete_documents ?? 0,
            is_on_maternity_leave: payrollDetails.details.is_on_maternity_leave ?? 0,
            is_hold: payrollDetails.details.is_hold ?? 0,
            save_changes: false,
            reload_deductions: false,
            modify_deductions: formHandler.values.modify_deductions,
        });
    }, [payrollDetails]);

    const formHandler = useFormik({
        initialValues: {
            regular_days: payrollDetails.details.regular_days ?? 0,
            special_leave: payrollDetails.details.special_leave ?? 0,
            cancelled_off: payrollDetails.details.cancelled_off ?? 0,
            cancelled_off_overtime: payrollDetails.details.cancelled_off_overtime ?? 0,
            special_holiday: payrollDetails.details.special_holiday ?? 0,
            legal_holiday: payrollDetails.details.legal_holiday ?? 0,
            regular_overtime: payrollDetails.details.regular_overtime ?? 0,
            night_differential: payrollDetails.details.night_differential ?? 0,
            night_differential_overtime: payrollDetails.details.night_differential_overtime ?? 0,
            legal_holiday_overtime: payrollDetails.details.legal_holiday_overtime ?? 0,
            special_holiday_overtime: payrollDetails.details.special_holiday_overtime ?? 0,
            non_taxable_adjustment: payrollDetails.non_taxable_adjustment ?? 0,
            adjustment_amount: payrollDetails.details.adjustment_amount ?? 0,
            tardiness_minutes: (payrollDetails.details.tardiness_minutes ?? []).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()),
            undertime_minutes: (payrollDetails.details.undertime_minutes ?? []).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()),
            timekeeping_branch_id: payrollDetails.timekeeping_branch_id,
            deductions: payrollDetails.deductions ?? [],
            employee_sss: payrollDetails.employee_sss ?? 0,
            employer_sss: payrollDetails.employer_sss ?? 0,
            employee_pagibig: payrollDetails.employee_pagibig ?? 0,
            employer_pagibig: payrollDetails.employer_pagibig ?? 0,
            employee_philhealth: payrollDetails.employee_philhealth ?? 0,
            employer_philhealth: payrollDetails.employer_philhealth ?? 0,
            withholding_tax: payrollDetails.withholding_tax ?? 0,
            is_manual_statutory_entry: payrollDetails.details.is_manual_statutory_entry ?? 0,
            is_complete_documents: payrollDetails.details.is_complete_documents ?? 0,
            is_on_maternity_leave: payrollDetails.details.is_on_maternity_leave ?? 0,
            is_hold: payrollDetails.details.is_hold ?? 0,
            remarks: payrollDetails.remarks,
            save_changes: false,
            reload_deductions: false,
            modify_deductions: false,
        },
        validateOnChange: false,
        onSubmit: async (values, {setSubmitting}) => {
            if (
                !canEditRestrictedRecords(permissions, "PAYROLL", "EMPLOYEE", payrollDetails.employee.employee_number, 0) ||
                !canEditRestrictedRecords(permissions, "PAYROLL", "BRANCH", "", payrollDetails.timekeeping_branch_id)
            ) {
                return;
            }

            if (values.save_changes) {
                setSubmitting(true);
                const isConfirmed = await confirm({
                    message : "Are you sure you want to save changes",
                    title: "Payroll Details"
                });

                if (isConfirmed) {
                    try {
                        const resp = await previewPayrollComputation(Number(payrollId), values);

                        if (!resp.error) {
                            setPayrollDetails(resp.data);
                            toast.success("Payroll successfully updated");
                        } else {
                            toast.error(resp.data.message);
                        }
                    } catch {
                        toast.error("Error encountered")
                    } finally {
                        setSubmitting(false);
                    }
                }
            } else {
                setSubmitting(true);
                try {
                    const resp = await previewPayrollComputation(Number(payrollId), values);

                    if (!resp.error) {
                        setPayrollDetails(resp.data);
                    } else {
                        toast.error(resp.data.message);
                    }
                } catch {
                    toast.error("Error preview computation.");
                } finally {
                    setSubmitting(false);
                }
            }
        }
    });

    useEffect(() => {
        const handleKeyDown = (e: any) => {
            if (e.key === "Tab") {
                if (payrollDetails.status == "final") {
                    return;
                }

                e.preventDefault();
                formHandler.setFieldValue("save_changes", false);
                formHandler.setFieldValue("reload_deductions", false);
                formHandler.submitForm();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [payrollDetails.status]);


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
                        <ContributionCard
                            formHandler={formHandler}
                        />
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
                    { (permissions.includes("perform_compensation_incentives") && Number(cutOff.part) == 1 ) &&
                        <div className="mt-[16px]">
                            <IncentivesCard/>
                        </div>
                    }

                    { Number(cutOff.part) == 2 &&
                        <div className="mt-[16px]">
                            <TardinessDetails/>
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