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

const CompanyDropDown = ({
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
                    label: "Savory Fast Food Inc.",
                    value: "Savory Fast Food Inc."
                },
                {
                    label: "Tony Ting Food Concepts Inc.",
                    value: "Tony Ting Food Concepts Inc."
                }
            ]}
            required={required}
        />
    );
};

export default CompanyDropDown;