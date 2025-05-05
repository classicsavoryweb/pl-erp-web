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

const EmployeeTypeDropDown = ({
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
                    label: "Direct",
                    value: "direct"
                },
                {
                    label: "Agency",
                    value: "agency"
                }
            ]}
            required={required}
        />
    );
};

export default EmployeeTypeDropDown;