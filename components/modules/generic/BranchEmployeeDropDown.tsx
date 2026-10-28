"use cient";

import SearchableDropDown from "@/components/common/SearchableDropDown";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useBranchEmployeeStore } from "@/stores/useBranchEmployeeStore";
import { useState } from "react";

interface SelectInterface {
    label: string;
    placeholder?: string;
    name: string;
    onChange: (e: any) => void;
    error?: string;
    value?: string | number;
    required?: boolean;
    disabled?: boolean;
    allowClear?: boolean;
}

const BranchEmployeeDropDown = ({
    label,
    placeholder,
    name,
    onChange,
    error,
    value,
    required = false,
    disabled = false,
    allowClear = false,
}: SelectInterface) => {

    const {employees, loading, getBranchEmployees} = useBranchEmployeeStore();
    const [employeeData, setEmployeeData] = useState<any>([]);

    useAsyncEffect(() => {
        getBranchEmployees();
        if (employees && employees.length > 0) {
            const newDataset = employees.map((employee: any) => ({
                label: employee.full_name,
                value: employee.employee_number,
                obj: employee
            }));
            setEmployeeData(newDataset);
        } else {
            setEmployeeData([]);
        }
    }, [employees]);

    return (
        <SearchableDropDown
            label={label}
            placeholder={placeholder}
            name={name}
            onChange={onChange}
            error={error}
            value={value}
            loading={loading}
            options={employeeData}
            required={required}
            disabled={disabled}
            allowClear={allowClear}
        />
    );
};

export default BranchEmployeeDropDown;
