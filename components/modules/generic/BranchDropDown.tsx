"use cient";

import SearchableDropDown from "@/components/common/SearchableDropDown";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useBranchStore } from "@/stores/useBranchStore";
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
    withAllOption?: boolean;
}

const BranchDropDown = ({
    label,
    placeholder,
    name,
    onChange,
    error,
    value,
    required = false,
    disabled = false,
    withAllOption = false
}: SelectInterface) => {

    const [branchData, setBranchData] = useState<any>([]);
    const {branches, loading, getBranches} = useBranchStore();

    useAsyncEffect(() => {        
        getBranches();
        if (branches.length > 0) {
            const newDataset = branches.map((branch: any) => ({
                label: branch.name,
                value: branch.id,
                obj: branch,
            }));
            setBranchData(newDataset);
        }
    }, [branches]);

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
                withAllOption
                    ? [{label: "All Branches", value: 0},...branchData]
                    : branchData
            }
            disabled={disabled}
            required={required}
        />
    );
};

export default BranchDropDown;