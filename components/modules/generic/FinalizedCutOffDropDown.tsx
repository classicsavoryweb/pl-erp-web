"use client";

import SearchableDropDown from "@/components/common/SearchableDropDown";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useCutOffStore } from "@/stores/useCutOffStore";
import moment from "moment";
import { useMemo } from "react";

interface FinalizedCutOffDropDownProps {
    label?: string;
    placeholder?: string;
    name?: string;
    onChange: (e: any) => void;
    error?: string;
    value?: string | number;
    required?: boolean;
    disabled?: boolean;
}

const FinalizedCutOffDropDown = ({
    label = "Cut Off",
    placeholder = "select cutoff",
    name = "cutoff",
    onChange,
    error,
    value,
    required = false,
    disabled = false,
}: FinalizedCutOffDropDownProps) => {
    const { cut_offs, loading, getCutOffs } = useCutOffStore();

    useAsyncEffect(() => {
        getCutOffs();
    }, []);

    const options = useMemo(() => {
        return cut_offs.map((cutOff: any) => ({
            label: `${moment(cutOff.start_date).format("MMM D")} - ${moment(cutOff.end_date).format("MMM D, YYYY")}`,
            value: String(cutOff.id),
            obj: cutOff,
        }));
    }, [cut_offs]);

    return (
        <SearchableDropDown
            label={label}
            placeholder={placeholder}
            name={name}
            onChange={onChange}
            error={error}
            value={value}
            loading={loading}
            options={options}
            required={required}
            disabled={disabled}
        />
    );
};

export default FinalizedCutOffDropDown;
