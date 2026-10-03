"use cient";

import SearchableDropDown from "@/components/common/SearchableDropDown";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useUniformSizeStore } from "@/stores/useUniformSizeStore";
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

const UniformSizesDropdown = ({
    label,
    placeholder,
    name,
    onChange,
    error,
    value,
    required = false,
    disabled = false,
}: SelectInterface) => {

    const {sizes, loading, getUniformItemZiseOptions} = useUniformSizeStore();
    const [dataSet, setDataSet] = useState<any>([]);

    useAsyncEffect(() => {
        getUniformItemZiseOptions();
        const newDataset = sizes.map((item: any) => {
            return {
                label: item.description,
                value: item.id,
                obj: item,
            };
        });

        setDataSet(newDataset);
    }, [sizes]);

    return (
        <SearchableDropDown
            label={label}
            placeholder={placeholder}
            name={name}
            onChange={onChange}
            error={error}
            value={value}
            loading={loading}
            options={dataSet}
            required={required}
            disabled={disabled}
        />
    );
};

export default UniformSizesDropdown;
