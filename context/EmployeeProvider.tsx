"use client";

import { createContext, useState } from "react";
import { useParams } from "next/navigation";
import { useAsyncEffect } from "@/hooks/async-effect";
import { getEmployee } from "@/api/employee";
import { toast } from "react-toastify";

interface EmployeeContextType {
    employee: {
        id: string,
        employee_number: string,
        biometric_number: string,
        image: string,
        first_name: string,
        middle_name: string,
        last_name: string,
        email: string,
        civil_status: string,
        gender: string,
        height: string,
        birthday: string,
        birthplace: string,
        address: string,
        provincial_address: string,
        region: string,
        contact_number: string,
        tax_type: string,
        tin: string,
        sss: string,
        philhealth: string,
        pagibig: string,
        referred_by: string,
        remarks: string,
        date_hired: string,
        type: string,
        emergency_contact_name: string,
        emergency_contact_number: string,
        emergency_contact_address: string,
        emergency_contact_relationship: string,
        education_history_id: string,
        agency_id: any,
        employee_status_id: string,
        position_id: string,
        station_id: string,
        branch_id: string,
        home_branch_id: string,
        status: string,
        current_position: any,
        agency: any,
        current_branch: any,
        station: any,
        employee_status: any,
        home_branch: any,
        branches: any[],
        positions: any[],
        education: any,
        dependents: any[],
        contracts: any[],
        regularization_date: string,
        separation_date: string,
        separation_reason: string,
        profile_picture: any;
    };
    loading: boolean;
    triggerReload: () => void;
};

const EmployeeInitialValue = {
    id: "",
    employee_number: "",
    biometric_number: "",
    image: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    civil_status: "",
    gender: "",
    height: "",
    birthday: "",
    birthplace: "",
    address: "",
    provincial_address: "",
    region: "",
    contact_number: "",
    tax_type: "",
    tin: "",
    sss: "",
    philhealth: "",
    pagibig: "",
    referred_by: "",
    remarks: "",
    date_hired: "",
    type: "",
    emergency_contact_name: "",
    emergency_contact_number: "",
    emergency_contact_address: "",
    emergency_contact_relationship: "",
    education_history_id: "",
    agency_id: null,
    employee_status_id: "",
    position_id: "",
    station_id: "",
    branch_id: "",
    home_branch_id: "",
    status: "",
    current_position: {},
    agency: null,
    current_branch: {},
    station: {},
    employee_status: {},
    home_branch: {},
    branches: [],
    positions: [],
    education: {
        employee_id: "",
        employee_number: "",
        college: "",
        college_address: "",
        course: "",
        college_date_started: "",
        college_date_graduated: "",
        highschool: "",
        highschool_address: "",
        highschool_date_started: "",
        highschool_date_graduated: "",
        remarks: null
    },
    dependents: [],
    contracts: [],
    regularization_date: "",
    separation_date: "",
    separation_reason: "",
    profile_picture: "",
};

export const EmployeeContext = createContext<EmployeeContextType>({
    employee: EmployeeInitialValue,
    loading: true,
    triggerReload: () => {}
});

const EmployeeProvider = ({
    children
}: {children: React.ReactNode}) => {
    const [employee, setEmployee] = useState<any>(EmployeeInitialValue);
    const [loading, setLoading] = useState<boolean>(true);
    const [reload, setReload] = useState<boolean>(true);
    const params = useParams();
    const employeeNumber = params["employee-number"];

    const triggerReload = () => {
        setReload(prev => !prev);
    };

    useAsyncEffect(() => {
        if (employeeNumber) {
            setLoading(true);
            getEmployee(String(employeeNumber))
            .then((resp) => {
                if (!resp.error) {
                    setEmployee(resp.data.employee);
                } else {
                    toast.error(resp.data.message); 
                }
    
            }).catch(() => {
                toast.error("Error fetching employee details");
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [employeeNumber, reload]);

    return (
        <EmployeeContext.Provider value={{
            employee,
            loading,
            triggerReload
        }}>
            {children}
        </EmployeeContext.Provider>
    );
};

export default EmployeeProvider;