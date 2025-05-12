"use cient";

import Dropdown from "@/components/common/Dropdown";

interface SelectInterface {
    label: string;
    placeholder?: string;
    name: string;
    onChange: (e: any) => void;
    error?: string;
    value?: string;
    required?: boolean;
}

const TaxTypeDropDown = ({
    label,
    placeholder,
    name,
    onChange,
    error,
    value,
    required = false
}: SelectInterface) => {

    return (
        <Dropdown
            label={label}
            placeholder={placeholder}
            name={name}
            onChange={onChange}
            error={error}
            value={value}
            options={[
                {
                    label: "Z",
                    value: "Z"
                },
                {
                    label: "S",
                    value: "S"
                },
                {
                    label: "M",
                    value: "M"
                },
                {
                    label: "M1",
                    value: "M1"
                },
                {
                    label: "M2",
                    value: "M2"
                },
                {
                    label: "M3",
                    value: "M3"
                },
                {
                    label: "M4",
                    value: "M4"
                },
                {
                    label: "S1",
                    value: "S1"
                },
                {
                    label: "S2",
                    value: "S2"
                },
                {
                    label: "S3",
                    value: "S3"
                },
                {
                    label: "S4",
                    value: "S4"
                },
            ]}
            required={required}
        />
    );
};

export default TaxTypeDropDown;