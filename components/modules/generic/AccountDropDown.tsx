"use client";

import { getAccounts } from "@/api/accounting/accounts";
import DebounceSearchableDropDown from "@/components/common/DebounceSearchableDropDown";

interface SelectInterface {
    label: string;
    placeholder?: string;
    name: string;
    onChange: (e: any) => void;
    error?: string;
    value?: string | number;
    required?: boolean;
    status?: "active" | "inactive";
    disabled?: boolean;
}

const AccountDropDown = ({
    label,
    placeholder,
    name,
    onChange,
    error,
    value,
    required = false,
    disabled = false
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
            api={getAccounts}
            mapResponse={(acc: any) => ({
                label: `${acc.acc_name}`,
                value: `${acc.acc_no}`,
            })}
            transformResponse={(resp: any) => resp?.data?.accounts || []}
            disabled={disabled}
        />
    );
};

export default AccountDropDown;