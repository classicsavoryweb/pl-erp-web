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

const OffenseActionDropDown = ({
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
                    label: "AO for Email",
                    value: "AO for Email"
                },
                {
                    label: "Short Memo for Email",
                    value: "Short Memo for Email"
                },
                {
                    label: "Signed AO for DA",
                    value: "Signed AO for DA"
                },
                {
                    label: "Signed AO for Suspension",
                    value: "Signed AO for Suspension"
                },
                {
                    label: "DA for Email",
                    value: "Male"
                },
                {
                    label: "Served",
                    value: "Served"
                },
            ]}
            required={required}
        />
    );
};

export default OffenseActionDropDown;