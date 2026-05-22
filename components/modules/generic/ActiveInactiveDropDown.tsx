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
    disabled?: boolean;
    withAllOption?: boolean;
}

const ActiveInactiveDropDown = ({
    label,
    placeholder,
    name,
    onChange,
    error,
    value,
    required = false,
    disabled = false, 
    withAllOption = false,
}: SelectInterface) => {

    return (
        <Dropdown
            label={label}
            placeholder={placeholder}
            name={name}
            onChange={onChange}
            error={error}
            value={value}
            options={
                withAllOption
                ?
                [
                    {
                        label: "All",
                        value: "all"
                    },
                    {
                        label: "Active",
                        value: "active"
                    },
                    {
                        label: "Inactive",
                        value: "inactive"
                    }
                ]
                :
                [
                    {
                        label: "Active",
                        value: "active"
                    },
                    {
                        label: "Inactive",
                        value: "inactive"
                    }
                ]
            }
            required={required}
            disabled={disabled}
        />
    );
};

export default ActiveInactiveDropDown;