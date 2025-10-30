"use client";

import { useReportsSSSStore } from "@/stores/useReportsSSSStore";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useState } from "react";
import Dropdown from "@/components/common/Dropdown";

interface SelectInterface {
    label: string;
    placeholder?: string;
    name: string;
    onChange: (e: any) => void;
    error?: string;
    value?: string | number;
    required?: boolean;
}

const ReportSSSDropDown = ({
    label,
    placeholder,
    name,
    onChange,
    error,
    value,
    required = false,
}: SelectInterface) => {
    
    const [reportSSSData, setReportSSSData] = useState<any[]>([]);
    const { reportsSSS, loading, getReportsSSSLoanTypes } = useReportsSSSStore();

    useAsyncEffect(() => {
        getReportsSSSLoanTypes();
        if (reportsSSS.length > 0) {
            const newDataset = reportsSSS.map((reportSSS: string) => ({
                label: reportSSS,
                value: reportSSS,
                obj: { description: reportSSS, id: reportSSS },
            }));
            setReportSSSData(newDataset);
        }
    }, [reportsSSS]);

    return (
        <Dropdown
            label={label}
            placeholder={placeholder}
            name={name}
            onChange={onChange}
            error={error}
            value={value}
            loading={loading}
            options={reportSSSData}
            required={required}
        />
    );
};

export default ReportSSSDropDown;
