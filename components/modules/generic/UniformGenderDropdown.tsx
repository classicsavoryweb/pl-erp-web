"use cient";

import SearchableDropDown from "@/components/common/SearchableDropDown";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useUniformGenderStore } from "@/stores/useUniformGenderStore";
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

const UniformGenderDropdown = ({
    label,
    placeholder,
    name,
    onChange,
    error,
    value,
    required = false,
    disabled = false,
}: SelectInterface) => {

    const {gender, loading, getUnifomGender} = useUniformGenderStore();
    const [dataSet, setDataSet] = useState<any>([]);

    useAsyncEffect(() => {
        getUnifomGender();
        const newDataset = gender.map((item: any) => {
            return {
                label: item.description,
                value: item.id,
                obj: item,
            };
        });

        setDataSet(newDataset);
    }, [gender]);

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

export default UniformGenderDropdown;
