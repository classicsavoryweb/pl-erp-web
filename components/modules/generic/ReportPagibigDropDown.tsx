"use client";

import { useReportsPagibigStore } from "@/stores/useReportsPagibigStore";
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
    additionalOptions?: {
        label: string;
        value: string | number;
        obj?: any;
    }[];
}

const ReportPagibigDropDown = ({
    label,
    placeholder,
    name,
    onChange,
    error,
    value,
    required = false,
    additionalOptions,
}: SelectInterface) => {
    
    const [reportPagibigData, setReportPagibigData] = useState<any[]>([]);
    const { reportsPagibig, loading, getReportsPagibigLoanTypes } = useReportsPagibigStore();

    useAsyncEffect(() => {
        getReportsPagibigLoanTypes();
        if (reportsPagibig.length > 0) {
            const newDataset = reportsPagibig.map((reportPagibig: string) => ({
                label: reportPagibig,
                value: reportPagibig,
                obj: { description: reportPagibig, id: reportPagibig },
            }));
            setReportPagibigData(newDataset);
        }
    }, [reportsPagibig]);

    const combinedOptions = additionalOptions
        ? [...additionalOptions, ...reportPagibigData]
        : reportPagibigData;

    return (
        <Dropdown
            label={label}
            placeholder={placeholder}
            name={name}
            onChange={onChange}
            error={error}
            value={value}
            loading={loading}
            options={combinedOptions}
            required={required}
        />
    );
};

export default ReportPagibigDropDown;
