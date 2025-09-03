"use client";

import { getEmployeesList } from "@/api/employee";
import DebounceSearchableDropDown from "@/components/common/DebounceSearchableDropDown";

interface SelectInterface {
    label: string;
    placeholder?: string;
    name: string;
    onChange: (e: any) => void;
    error?: string;
    value?: any;
    required?: boolean;
    status?: "active" | "inactive"
}

const SearchEmployeeDropDown = ({
    label,
    placeholder,
    name,
    onChange,
    error,
    value,
    required = false,
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
            api={getEmployeesList}
            status={status}
            mapResponse={(emp: any) => ({
                label: `${emp.last_name}, ${emp.first_name} ${emp.middle_name || ""}`,
                value: emp,
            })}
            transformResponse={(resp: any) => resp?.data || []}
        />
    );
};

export default SearchEmployeeDropDown;