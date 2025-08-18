"use cient";

import SearchableDropDown from "@/components/common/SearchableDropDown";
import { useAsyncEffect } from "@/hooks/async-effect";
import { usePositionStore } from "@/stores/usePositionStore";
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

const PositionDropDown = ({
    label,
    placeholder,
    name,
    onChange,
    error,
    value,
    required = false
}: SelectInterface) => {

    const { positions, loading, getPositions } = usePositionStore();
    const [dataSet, setDataSet] = useState<any>([]);
    
    useAsyncEffect(() => {
        getPositions();
        const newDataset = positions.map((position: any) => {
            return {
                label: position.description,
                value: position.id,
                obj: position
            };
        });
        setDataSet(newDataset);
    }, [positions]);

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
        />
    );
};

export default PositionDropDown;