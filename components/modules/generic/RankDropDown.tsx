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

const RankDropDown = ({
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
                    label: "1",
                    value: "1"
                },
                {
                    label: "2",
                    value: "2"
                },
                {
                    label: "3",
                    value: "3"
                }
            ]}
            required={required}
        />
    );
};

export default RankDropDown;