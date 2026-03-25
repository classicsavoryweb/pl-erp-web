"use client";
import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useAsyncEffect } from "@/hooks/async-effect";
import { Incentives, PayrollDetails } from "@/constants/interfaces/interface";
import { getPayroll } from "@/api/compensation/payroll";

interface PayrollContextType {
    payrollDetails: PayrollDetails;
    incentivesDetails: Incentives;
    loading: boolean;
    triggerReload: () => void;
    setPayrollDetails: Dispatch<SetStateAction<PayrollDetails>>;
    setIncentivesDetails: Dispatch<SetStateAction<Incentives>>;
    error: boolean;
}

const defaultPayrollDetails: PayrollDetails = {
    id: 0,
    employee_id: "",
    timekeeping_summary_id: "",
    timekeeping_branch_id: "",
    pay_date: "",
    cut_off: "",
    start_date: "",
    end_date: "",
    daily_rate: "",
    hourly_rate: "",
    pay_type: "",
    tax_status: "",
    salary: "",
    tardiness_amount: "",
    undertime_amount: "",
    overtime_amount: "",
    legal_holiday_amount: "",
    legal_holiday_overtime_amount: "",
    special_holiday_amount: "",
    special_holiday_overtime_amount: "",
    night_differential_amount: "",
    night_differential_overtime_amount: "",
    taxable_adjustment: "",
    non_taxable_adjustment: "",
    cancelled_off: "",
    gross_pay: "",
    employee_sss: "",
    employer_sss: "",
    employee_pagibig: "",
    employer_pagibig: "",
    employee_philhealth: "",
    employer_philhealth: "",
    withholding_tax: "",
    deductions: "",
    total_deductions: "",
    manual_deductions: "",
    net_pay: "",
    status: "",
    remarks: "",
    created_at: "",
    updated_at: "",
    employee: {} as any,
    position: {} as any,
    timekeeping_branch: {} as any,
    details: {} as any,
    incentives: {} as any,
    tardiness_list: [],
    undertime_list: [],
    taxable_income : "",
    contribution_total : "",
    additional_working_hours_total: "",
    working_hours_deduction_total: "",
    tardiness_offenses: [],
    special_leave: "",
    payroll_list: {} as any,
};

const defaultIncentivesDetails: Incentives = {
    id: 0,
    employee_id: "",
    position_id: "",
    branch_id: "",
    incentive_amount: 0,
    max_amount: 0,
    remarks: "",
    pay_date: "",
    amount_rate: 0,
    additional_incentive: 0,
    adjustment_days: 0,
    adjustment_percent: 0,
    status: "",
    days: 0,
    worked_days: 0
};

export const PayrollContext = createContext<PayrollContextType>({
    payrollDetails: defaultPayrollDetails,
    incentivesDetails: defaultIncentivesDetails,
    loading: true,
    triggerReload: () => {},
    setPayrollDetails: () => {},
    setIncentivesDetails: () => {},
    error: false,
});

const PayrollProvider = ({
    children
}: {children: React.ReactNode}) => {
    const [payrollDetails, setPayrollDetails] = useState<PayrollDetails>(defaultPayrollDetails);
    const [incentivesDetails, setIncentivesDetails] = useState<Incentives>(defaultIncentivesDetails);
    const [loading, setLoading] = useState<boolean>(true);
    const [reload, setReload] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const params = useParams();
    const payrollId = params["payroll-id"];

    const triggerReload = () => {
        setReload(prev => !prev);
    };

    useAsyncEffect(() => {
        if (payrollId) {
            setLoading(true);
            getPayroll(Number(payrollId))
            .then((resp) => {
                if (!resp.error) {
                    setPayrollDetails(resp.data);
                    setIncentivesDetails({ 
                        ...resp.data.incentives, 
                        days: resp.data.days, 
                        worked_days: resp.data.worked_days 
                    });
                } else {
                    toast.error(resp.data.message); 
                    setError(true);
                }
            }).catch(() => {
                toast.error("Error fetching payroll details");
                setError(true);
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [payrollId, reload]);
    
    return (
        <PayrollContext.Provider value={{
            payrollDetails,
            setPayrollDetails,
            incentivesDetails,
            setIncentivesDetails,
            loading,
            triggerReload,
            error
        }}>
            {children}
        </PayrollContext.Provider>
    );
};

export default PayrollProvider;