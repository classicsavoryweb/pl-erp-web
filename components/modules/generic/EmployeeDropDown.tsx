"use cient";

import SearchableDropDown from "@/components/common/SearchableDropDown";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useEmployeeStore } from "@/stores/useEmployeeStore";
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
}

const EmployeeDropDown = ({
    label,
    placeholder,
    name,
    onChange,
    error,
    value,
    required = false,
    disabled = false,
}: SelectInterface) => {

    const {employees, loading, getEmployees} = useEmployeeStore();
    const [dataSet, setDataSet] = useState<any>([]);

    useAsyncEffect(() => {
        getEmployees();
        const newDataset = employees.map((employee: any) => {
            return {
                label: employee.full_name,
                value: employee.employee_number,
                obj: employee
            };
        });

        setDataSet(newDataset);
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
            options={dataSet}
            required={required}
            disabled={disabled}
        />
    );
};

export default EmployeeDropDown;