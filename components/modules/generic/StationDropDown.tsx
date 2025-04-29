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

const StationDropDown = ({
    label,
    placeholder,
    name,
    onChange,
    error,
    value,
    required = false
}: SelectInterface) => {

    const api = useApiCall();

    useAsyncEffect(() => {
        api.setLoading(true);
        getStations()
        .then((resp) => {
            if (!resp.error) {
                const newDataset = resp.data.stations.map((role: any) => {
                    return {
                        label: role.name,
                        value: role.id
                    };
                });
                api.setDataSet(newDataset);
            }
        })
        .finally(() => {
            api.setLoading(false);
        });
    }, []);

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

export default StationDropDown;