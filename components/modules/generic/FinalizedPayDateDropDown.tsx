"use client";

import SearchableDropDown from "@/components/common/SearchableDropDown";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useState } from "react";
import { useCSHubTransactionTypeStore } from "@/stores/useCSHubTransactionTypeStore";
import { useCutOffStore } from "@/stores/useCutOffStore";

interface SelectInterface {
    label: string;
    placeholder?: string;
    name: string;
    onChange: (e: any) => void;
    error?: string;
    value?: string | number;
    required?: boolean;
    withRangeOption?: boolean;
}

const FinalizedPayDateDropDown = ({
    label,
    placeholder,
    name,
    onChange,
    error,
    value,
    required = false,
    withRangeOption = false,
}: SelectInterface) => {

    const [data, setData] = useState<any>([]);
    const {cut_offs, loading, getCutOffs} = useCutOffStore();

    useAsyncEffect(() => {        
        getCutOffs();
        if (cut_offs.length > 0) {
            const newDataset = cut_offs.map((cut_off: any) => ({
                label: cut_off.pay_date,
                value: cut_off.id,
                obj: cut_off,
            }));
            setData(newDataset);
        }
    }, [cut_offs]);

    return (
        <SearchableDropDown
            label={label}
            placeholder={placeholder}
            name={name}
            onChange={onChange}
            error={error}
            value={value}
            loading={loading}
            options={
                withRangeOption
                ? [
                    {
                        label: "Date Range",
                        value: 0,
                    },
                    ...data,
                ]
                : data
            }
            required={required}
        />
    );
};

export default FinalizedPayDateDropDown;