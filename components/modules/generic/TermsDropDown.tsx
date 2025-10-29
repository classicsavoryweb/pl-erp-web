"use cient";

import Dropdown from "@/components/common/Dropdown";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useTermsStore } from "@/stores/useTermsStore";
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

const TermsDropDown = ({
    label,
    placeholder,
    name,
    onChange,
    error,
    value,
    required = false
}: SelectInterface) => {

    const {terms, loading, getTerms} = useTermsStore();
    const [dataSet, setDataSet] = useState<any>([]);

    useAsyncEffect(() => {
        getTerms();
        const newDataset = terms.map((term: any) => {
            return {
                label: term.description,
                value: term.id,
                obj: term
            };
        });

        setDataSet(newDataset);
    }, [terms]);

    return (
        <Dropdown
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

export default TermsDropDown;