"use client";

import SearchableDropDown from "@/components/common/SearchableDropDown";
import { useDeductionStore } from "@/stores/useDeductionStore";
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
}

const DeductionDropDown = ({
    label,
    placeholder,
    name,
    onChange,
    error,
    value,
    required = false
}: SelectInterface) => {

    const [deductionData, setDeductionData] = useState<any>([]);
    const {deductions, loading, getDeduction} = useDeductionStore();

    useAsyncEffect(() => {        
        getDeduction();
        if (deductions.length > 0) {
            const newDataset = deductions.map((deduction: any) => ({
                label: deduction.description,
                value: deduction.id,
                obj: deduction,
            }));
            setDeductionData(newDataset);
        }
    }, [deductions]);

    return (
        <SearchableDropDown
            label={label}
            placeholder={placeholder}
            name={name}
            onChange={onChange}
            error={error}
            value={value}
            loading={loading}
            options={deductionData}
            required={required}
        />
    );
};

export default DeductionDropDown;