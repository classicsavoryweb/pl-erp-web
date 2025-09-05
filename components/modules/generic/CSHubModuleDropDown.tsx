"use client";

import Dropdown from "@/components/common/Dropdown";
import { useModuleStore } from "@/stores/useCSHubModuleStore";
import { useAsyncEffect } from "@/hooks/async-effect";
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

const CSHubModuleDropDown = ({
    label,
    placeholder,
    name,
    onChange,
    error,
    value,
    required = false
}: SelectInterface) => {

    const [moduleData, setModuleData] = useState<any>([]);
    const {modules, loading, getCSHubModules} = useModuleStore();

    useAsyncEffect(() => {        
        getCSHubModules();
        if (modules.length > 0) {
            const newDataset = modules.map((module: any) => ({
                label: module.description,
                value: module.id,
                obj: module,
            }));
            setModuleData(newDataset);
        }
    }, [modules]);

    return (
        <Dropdown
            label={label}
            placeholder={placeholder}
            name={name}
            onChange={onChange}
            error={error}
            value={value}
            loading={loading}
            options={moduleData}
            required={required}
        />
    );
};

export default CSHubModuleDropDown;