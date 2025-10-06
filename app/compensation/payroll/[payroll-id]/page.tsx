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
import { useContext, useEffect } from "react";
import confirm from "@/components/common/Confirm";
import { toast } from "react-toastify";
import { updatePayrollDetails } from "@/api/compensation/payroll";
import { updatePayrollIncentive } from "@/api/compensation/payroll";
import * as Yup from "yup";
import IncentivesCard from "@/components/modules/compensation/payroll/payroll-details/IncentivesCard";

const Page = () => {
    const params = useParams();
    const payrollId = params["payroll-id"];
    const { setPayrollDetails ,payrollDetails } = useContext(PayrollContext);
    const { setIncentivesDetails ,incentivesDetails } = useContext(PayrollContext);

    useEffect(() => {
        formHandler.setValues({
            non_taxable_adjustment: payrollDetails.non_taxable_adjustment,
            manual_deductions: payrollDetails.manual_deductions,
            remarks: payrollDetails.remarks
        });

        incentivesformHandler.setValues({
            adjustment_percent: incentivesDetails.adjustment_percent,
        });

    }, [payrollDetails, incentivesDetails]);

    const formHandler = useFormik({
        initialValues: {
            non_taxable_adjustment: payrollDetails.non_taxable_adjustment,
            manual_deductions: payrollDetails.manual_deductions,
            remarks: payrollDetails.remarks
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            manual_deductions: Yup.number().required("Manual deductions is required"),
            non_taxable_adjustment: Yup.number().required("Non taxable adjustment is required")
        }),
        onSubmit: async (values) => {
            const isConfirmed = await confirm({
                message : "Are you sure you want to save changes",
                title: "Payroll Details"
            });

            isConfirmed && updatePayrollDetails(payrollDetails.id, values)
            .then((resp) => {
                if (!resp.error) {
                    toast.success(resp.data.message);
                    setPayrollDetails(resp.data.details);
                } else {
                    toast.error(resp.data.message);
                }
            }).catch(() => {
                toast.error("Error encountered");
            });
        }
    });

    const incentivesformHandler = useFormik({
        initialValues: {
            adjustment_percent: incentivesDetails.adjustment_percent,
        },
        validateOnChange: false,
        onSubmit: async (values) => {
            const isConfirmed = await confirm({
                message : "Are you sure you want to save changes",
                title: "Incentives"
            });

            isConfirmed && updatePayrollIncentive(payrollDetails.id, values)
            .then((resp) => {
                if (!resp.error) {
                    toast.success(resp.data.message);
                    setIncentivesDetails(resp.data.incentives);
                } else {
                    toast.error(resp.data.message);
                }
            }).catch(() => {
                toast.error("Error encountered");
            });
        }
    });

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
                    <div className="mt-[16px]">
                        <PayrollDeductionTableCard/>
                    </div>
                    <div className="mt-[16px]">
                        <form onSubmit={incentivesformHandler.handleSubmit}>
                            <IncentivesCard
                                incentivesformHandler={incentivesformHandler}
                            />
                        </form>
                    </div>
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