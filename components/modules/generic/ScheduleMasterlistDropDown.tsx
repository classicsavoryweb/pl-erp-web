"use cient";

import { getSanctions } from "@/api/offenses";
import { getScheduleMasterlist } from "@/api/schedule-masterlist";
import { getScheduleType } from "@/api/schedule-type";
import SearchableDropDown from "@/components/common/SearchableDropDown";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
interface SelectInterface {
    label: string;
    placeholder?: string;
    name: string;
    onChange: (e: any) => void;
    error?: string;
    value?: string | number;
    required?: boolean;
}

const ScheduleMasterlistDropDown = ({
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
        getScheduleMasterlist()
        .then((resp) => {
            if (!resp.error) {
                const newDataset = resp.data.schedule_masterlist.map((data: any) => {
                    return {
                        label: data.selection,
                        value: data.selection
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
        <SearchableDropDown
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

export default ScheduleMasterlistDropDown;