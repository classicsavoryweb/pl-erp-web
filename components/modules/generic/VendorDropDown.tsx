"use client";

import { getVendors } from "@/api/accounting/vendors";
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
}

const VendorDropDown = ({
    label,
    placeholder,
    name,
    onChange,
    error,
    value,
    required = false,
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
            api={getVendors}
            mapResponse={(ven: any) => ({
                label: `${ven.ven_name}`,
                value: `${ven.ven_no}`,
            })}
            transformResponse={(resp: any) => resp?.data?.vendors || []}
        />
    );
};

export default VendorDropDown;