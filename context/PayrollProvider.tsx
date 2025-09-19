"use client";
import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useAsyncEffect } from "@/hooks/async-effect";
import { PayrollDetails } from "@/constants/interfaces/interface";

interface PayrollContextType {
    payrollDetails: PayrollDetails;
    loading: boolean;
    triggerReload: () => void;
    setPayrollDetails: Dispatch<SetStateAction<PayrollDetails>>;
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
    timekeeping_branch: {} as any,
    timekeeping_summary: {} as any,
    lates: []
};

export const PayrollContext = createContext<PayrollContextType>({
    payrollDetails: defaultPayrollDetails,
    loading: true,
    triggerReload: () => {},
    setPayrollDetails: () => {}
});

const PayrollProvider = ({
    children
}: {children: React.ReactNode}) => {
    const [payrollDetails, setPayrollDetails] = useState<PayrollDetails>(defaultPayrollDetails);
    const [loading, setLoading] = useState<boolean>(true);
    const [reload, setReload] = useState<boolean>(true);
    const params = useParams();
    const payrollId = params["payroll-id"];

    const triggerReload = () => {
        setReload(prev => !prev);
    };

    useAsyncEffect(() => {
        if (payrollId) {
            setLoading(true);
            // getEmployee("",(payrollId))
            // .then((resp) => {
            //     if (!resp.error) {
            //         setEmployee(resp.data.employee);
            //     } else {
            //         toast.error(resp.data.message); 
            //     }
    
            // }).catch(() => {
            //     toast.error("Error fetching employee details");
            // }).finally(() => {
            //     setLoading(false);
            // });
        }
    }, [payrollId, reload]);
    
    return (
        <PayrollContext.Provider value={{
            payrollDetails,
            setPayrollDetails,
            loading,
            triggerReload
        }}>
            {children}
        </PayrollContext.Provider>
    );
};

export default PayrollProvider;