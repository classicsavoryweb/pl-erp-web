"use client";

import SearchableDropDown from "@/components/common/SearchableDropDown";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useRegionStore } from "@/stores/useRegionStore";
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

interface RegionOption {
    name?: string | null;
    description?: string | null;
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
    const { regions, loading, getRegions } = useRegionStore();

    useAsyncEffect(() => {
        getRegions();
    }, []);

    const regionOptions = useMemo(() => {
        const options = regions
            .map((region: RegionOption) => {
                const name = region.name?.trim();
                const description = region.description?.trim();

                if (!name) {
                    return null;
                }

                return {
                    label: description || name,
                    value: name,
                };
            })
            .filter((region): region is { label: string; value: string } => Boolean(region))
            .sort((a, b) => a.label.localeCompare(b.label));

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
    }, [regions, value]);

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
