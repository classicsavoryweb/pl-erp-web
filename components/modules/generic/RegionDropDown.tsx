"use client";

import SearchableDropDown from "@/components/common/SearchableDropDown";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useFilterBranchStore } from "@/stores/useFilterBranchStore";
import { useMemo } from "react";

interface RegionDropDownProps {
    label: string;
    placeholder?: string;
    name: string;
    onChange: (e: any) => void;
    error?: string;
    value?: string | number;
    required?: boolean;
    disabled?: boolean;
}

interface BranchWithRegion {
    location?: string | null;
}

const RegionDropDown = ({
    label,
    placeholder,
    name,
    onChange,
    error,
    value,
    required = false,
    disabled = false,
}: RegionDropDownProps) => {
    const { branches, loading, getFilterBranches } = useFilterBranchStore();

    useAsyncEffect(() => {
        getFilterBranches();
    }, []);

    const regionOptions = useMemo(() => {
        const options = Array.from(
            new Set(
                branches
                    .map((branch: BranchWithRegion) => branch.location?.trim())
                    .filter((region): region is string => Boolean(region))
            )
        )
            .sort((a, b) => a.localeCompare(b))
            .map((region) => ({
                label: region,
                value: region,
            }));

        const selectedRegion = String(value ?? "").trim();

        if (!selectedRegion) {
            return options;
        }

        const hasSelectedRegion = options.some(
            (option) => option.value === selectedRegion
        );

        return hasSelectedRegion
            ? options
            : [{ label: selectedRegion, value: selectedRegion }, ...options];
    }, [branches, value]);

    return (
        <SearchableDropDown
            label={label}
            placeholder={placeholder}
            name={name}
            onChange={onChange}
            error={error}
            value={value}
            required={required}
            disabled={disabled}
            loading={loading}
            options={regionOptions}
        />
    );
};

export default RegionDropDown;
