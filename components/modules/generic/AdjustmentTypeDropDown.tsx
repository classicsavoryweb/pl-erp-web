"use cient";

import SearchableDropDown from "@/components/common/SearchableDropDown";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useAdjustmentTypeStore } from "@/stores/useAdjustmentTypeStore";
import { useState } from "react";
interface SelectInterface {
    label: string;
    placeholder?: string;
    name: string;
    onChange: (e: any) => void;
    error?: string;
    value?: string | number;
    required?: boolean;
    disabled?: boolean;
}

const AdjustmentTypeDropDown = ({
    label,
    placeholder,
    name,
    onChange,
    error,
    value,
    required = false,
    disabled = false,
}: SelectInterface) => {

    const [data, setData] = useState<any>([]);
    const {adjustmentTypes, loading, getAdjustmentTypes} = useAdjustmentTypeStore();

    useAsyncEffect(() => {        
        getAdjustmentTypes();
        if (adjustmentTypes.length > 0) {
            const newDataset = adjustmentTypes.map((data: any) => ({
                label: data.description,
                value: data.description,
                obj: data,
            }));
            setData(newDataset);
        }
    }, [adjustmentTypes]);

    return (
        <SearchableDropDown
            label={label}
            placeholder={placeholder}
            name={name}
            onChange={onChange}
            error={error}
            value={value}
            loading={loading}
            options={data}
            required={required}
            disabled={disabled}
        />
    );
};

export default AdjustmentTypeDropDown;
