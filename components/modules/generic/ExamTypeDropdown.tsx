"use client";

import SearchableDropDown from "@/components/common/SearchableDropDown";
import { useExamTypeStore } from "@/stores/useExamTypeStore";
import { useAsyncEffect } from "@/hooks/async-effect";
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

const ExamTypeDropdown = ({
    label,
    placeholder,
    name,
    onChange,
    error,
    value,
    required = false,
    disabled = false
}: SelectInterface) => {

    const [examData, setExamData] = useState<any>([]);
    const {exams, loading, getExamType} = useExamTypeStore();

    useAsyncEffect(() => {        
        getExamType();
        if (exams.length > 0) {
            const newDataset = exams.map((exam: any) => ({
                label: exam.description,
                value: exam.id,
                obj: exam,
            }));
            setExamData(newDataset);
        }
    }, [exams]);

    return (
        <SearchableDropDown
            label={label}
            placeholder={placeholder}
            name={name}
            onChange={onChange}
            error={error}
            value={value}
            loading={loading}
            options={examData}
            required={required}
            disabled={disabled}
        />
    );
};

export default ExamTypeDropdown;