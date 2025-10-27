"use client";

import { getVendors } from "@/api/accounting/vendors";
import { useVendorStore } from "@/stores/useVendorStore";
import SearchableDropDown from "@/components/common/SearchableDropDown";
import DebounceSearchableDropDown from "@/components/common/DebounceSearchableDropDown";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useState } from "react";

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

    const [vendorData, setVendorData] = useState<any>([]);
    const {vendors, loading, getVendor} = useVendorStore();

    useAsyncEffect(() => {        
        getVendor();
        if (vendors.length > 0) {
            const newDataset = vendors.map((vendor: any) => ({
                label: vendor.ven_name,
                value: vendor.ven_no,
                obj: vendor,
            }));
            setVendorData(newDataset);
        }
    }, [vendors]);

    return (
        <SearchableDropDown
            label={label}
            placeholder={placeholder}
            name={name}
            onChange={onChange}
            error={error}
            value={value}
            loading={loading}
            options={vendorData}
            required={required}
        />
    );
};

export default VendorDropDown;