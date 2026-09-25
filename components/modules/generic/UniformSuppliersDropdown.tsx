"use cient";

import SearchableDropDown from "@/components/common/SearchableDropDown";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useUniformSupplierStore } from "@/stores/useUniformSupllierStore";
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
 
const UniformSupplierDropdown = ({
    label,
    placeholder,
    name,
    onChange,
    error,
    value,
    required = false,
    disabled = false,
}: SelectInterface) => {

    const {supplier, loading, getUniformSupplier} = useUniformSupplierStore();
    const [dataSet, setDataSet] = useState<any>([]);

    useAsyncEffect(() => {
        getUniformSupplier();
        const newDataset = supplier.map((item: any) => {
            return {
                label: item.vendor_name,
                value: item.vendor_number,
                obj: item,
            };
        });

        setDataSet(newDataset);
    }, [supplier]);

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

export default UniformSupplierDropdown;
