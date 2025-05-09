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

const GenderDropDown = ({
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
                    label: "Male",
                    value: "Male"
                },
                {
                    label: "Female",
                    value: "Female"
                }
            ]}
            required={required}
        />
    );
};

export default GenderDropDown;