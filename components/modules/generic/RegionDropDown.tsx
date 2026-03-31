"use client";

import { getAllBranches } from "@/api/branches";
import Dropdown from "@/components/common/Dropdown";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

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

const RegionDropDown = ({
    label,
    placeholder,
    name,
    onChange,
    error,
    value,
    required,
    disabled,
}: RegionDropDownProps) => {
    const [regions, setRegions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;

        setLoading(true);
        getAllBranches({ per_page: 10000 })
            .then((resp) => {
                if (resp.error) {
                    toast.error("Error fetching regions");
                    return;
                }

                const nextRegions = Array.from(
                    new Set(
                        (resp.data?.data ?? [])
                            .map((branch: any) => branch.location)
                            .filter((region: string | null | undefined) => !!region)
                    )
                ) as string[];

                nextRegions.sort((a, b) => a.localeCompare(b));

                if (isMounted) {
                    setRegions(nextRegions);
                }
            })
            .catch(() => {
                toast.error("Error fetching regions");
            })
            .finally(() => {
                if (isMounted) {
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const regionOptions = [...regions];
    if (value && !regionOptions.includes(String(value))) {
        regionOptions.unshift(String(value));
    }

    return (
        <Dropdown
            label={label}
            placeholder={placeholder}
            name={name}
            onChange={onChange}
            error={error}
            value={value}
            required={required}
            disabled={disabled}
            loading={loading}
            options={regionOptions.map((region) => ({
                label: region,
                value: region,
            }))}
        />
    );
};

export default RegionDropDown;
