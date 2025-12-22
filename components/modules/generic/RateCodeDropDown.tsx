"use client";

import { getRates } from "@/api/rates";
import { getAllRoles } from "@/api/roles-and-permissions";
import Dropdown from "@/components/common/Dropdown";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useRatesStore } from "@/stores/useRateStore";
import { useState } from "react";
interface SelectInterface {
    label: string;
    placeholder?: string;
    name: string;
    onChange: (e: any) => void;
    error?: string;
    value?: string;
    required?: boolean;
}

const RateCodeDropDown = ({
    label,
    placeholder,
    name,
    onChange,
    error,
    value,
    required = false
}: SelectInterface) => {

    const [rateData, setRateData] = useState<any>([]);
    const {rates, loading, getRates} = useRatesStore();

    useAsyncEffect(() => {        
        getRates();
        if (rates.length > 0) {
            const newDataset = rates.map((rate: any) => ({
                label: rate.code,
                value: rate.code,
                obj: rate,
            }));
            setRateData(newDataset);
        }
    }, [rates]);

    return (
        <Dropdown
            label={label}
            placeholder={placeholder}
            name={name}
            onChange={onChange}
            error={error}
            value={value}
            loading={loading}
            options={rateData}
            required={required}
        />
    );
};

export default RateCodeDropDown;