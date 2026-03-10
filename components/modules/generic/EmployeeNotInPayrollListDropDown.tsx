"use client";

import { getEmployeesList, getEmployeesNotOnPayrollList } from "@/api/employee";
import DebounceSearchableDropDown from "@/components/common/DebounceSearchableDropDown";

interface SelectInterface {
    label: string;
    placeholder?: string;
    name: string;
    onChange: (e: any) => void;
    error?: string;
    value?: any;
    required?: boolean;
    disabled?: boolean;
    status?: "active" | "inactive" | "all";
}

const EmployeeNotInPayrollListDropDown = ({
    label,
    placeholder,
    name,
    onChange,
    error,
    value,
    required = false,
    disabled = false,
    status= "active",
}: SelectInterface) => {

    return (
        <DebounceSearchableDropDown
            label={label}
            placeholder={placeholder}
            name={name}
            onChange={onChange}
            error={error}
            value={value}
            required={required}
            api={getEmployeesNotOnPayrollList}
            status={status}
            disabled={disabled}
            mapResponse={(emp: any) => ({
                label: `${emp.last_name}, ${emp.first_name} ${emp.middle_name || ""} - ${emp.employee_number}`,
                value: emp,
            })}
            transformResponse={(resp: any) => resp?.data || []}
        />
    );
};

export default EmployeeNotInPayrollListDropDown;