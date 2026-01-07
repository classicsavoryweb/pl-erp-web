"use client";

import SearchableDropDown from "@/components/common/SearchableDropDown";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useState } from "react";
import { getATDAllowedDeductions } from "@/api/compensation/employee-deductions";

interface SelectInterface {
    label: string;
    placeholder?: string;
    name: string;
    onChange: (e: any) => void;
    error?: string;
    value?: string | number;
    required?: boolean;
}

const ATDDeductionDropDown = ({
    label,
    placeholder,
    name,
    onChange,
    error,
    value,
    required = false,
}: SelectInterface) => {
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState<any[]>([]);

    useAsyncEffect(() => {
        setLoading(true);
        getATDAllowedDeductions()
            .then((resp) => {
                const deductions = resp?.data?.deductions ?? [];
                const mapped = deductions.map((deduction: any) => ({
                    label: deduction.description,
                    value: deduction.id,
                    obj: deduction,
                }));
                setOptions(mapped);
            })
            .catch(() => {
                setOptions([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <SearchableDropDown
            label={label}
            placeholder={placeholder}
            name={name}
            onChange={onChange}
            error={error}
            value={value}
            loading={loading}
            options={options}
            required={required}
        />
    );
};

export default ATDDeductionDropDown;
