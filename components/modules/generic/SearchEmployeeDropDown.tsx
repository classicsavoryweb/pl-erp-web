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
    disabled?: boolean;
    status?: "active" | "inactive" | "all";
    type?: "Direct" | "Agency" | "all";
    rank?: "management" | "rank-file" | "all"
}

const SearchEmployeeDropDown = ({
    label,
    placeholder,
    name,
    onChange,
    error,
    value,
    required = false,
    disabled = false,
    status = "active",
    type = "all",
    rank = "all"
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
            disabled={disabled}
            type={type}
            mapResponse={(emp: any) => ({
                label: `${emp.last_name}, ${emp.first_name} ${emp.middle_name || ""} - ${emp.employee_number}`,
                value: emp,
            })}
            rank={rank}
            transformResponse={(resp: any) => resp?.data || []}
        />
    );
};

export default SearchEmployeeDropDown;