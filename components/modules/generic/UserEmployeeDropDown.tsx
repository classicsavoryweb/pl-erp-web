"use client";

import { getUsers } from "@/api/users";
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
}

const UserEmployeeDropDown = ({
    label,
    placeholder,
    name,
    onChange,
    error,
    value,
    required = false,
    disabled = false,
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
            disabled={disabled}
            api={getUsers}
            mapResponse={(user: any) => ({
                label: `${user.last_name}, ${user.first_name} ${user.middle_name || ""} - ${user.employee_number}`,
                value: user,
            })}
            transformResponse={(resp: any) => resp?.data || []}
        />
    );
};

export default UserEmployeeDropDown;
