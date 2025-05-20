"use cient";

import { getStations } from "@/api/station";
import Dropdown from "@/components/common/Dropdown";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
interface SelectInterface {
    label: string;
    placeholder?: string;
    name: string;
    onChange: (e: any) => void;
    error?: string;
    value?: string;
    required?: boolean;
}

const DoseDropDown = ({
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
                    label: "First Dose",
                    value: "First Dose"
                },
                {
                    label: "Second Dose",
                    value: "Second Dose"
                },
                {
                    label: "First Booster Shot",
                    value: "First Booster Shot"
                },
                {
                    label: "Second Booster Shot",
                    value: "Second Booster Shot"
                },
            ]}
            required={required}
        />
    );
};

export default DoseDropDown;