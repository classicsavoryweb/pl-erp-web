"use cient";

import { getAgencies } from "@/api/agencies";
import { getAllStatus, getStatus } from "@/api/employee-status";
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
    type?:"active"|"inactive";
}

const EmploymentStatusDropdown = ({
    label,
    placeholder,
    name,
    onChange,
    error,
    value,
    required = false,
    type="active"
}: SelectInterface) => {

    const api = useApiCall();

    useAsyncEffect(() => {
        api.setLoading(true);
        getStatus({
            type: type
        })
        .then((resp) => {
            if (!resp.error) {
                const newDataset = resp.data.status.map((status: any) => {
                    return {
                        label: status.description,
                        value: status.id
                    };
                });
                api.setDataSet(newDataset);
            }
        })
        .finally(() => {
            api.setLoading(false);
        });
    }, [type]);

    return (
        <Dropdown
            label={label}
            placeholder={placeholder}
            name={name}
            onChange={onChange}
            error={error}
            value={value}
            loading={api.loading}
            options={api.dataSet}
            required={required}
        />
    );
};

export default EmploymentStatusDropdown;