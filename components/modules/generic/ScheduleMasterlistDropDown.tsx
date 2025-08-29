"use cient";

import { getSanctions } from "@/api/offenses";
import { getScheduleMasterlist } from "@/api/schedule-masterlist";
import { getScheduleType } from "@/api/schedule-type";
import SearchableDropDown from "@/components/common/SearchableDropDown";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useScheduleMasterlistStore } from "@/stores/useScheduleMasterlistStore";
import { useState } from "react";
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

    const [data, setData] = useState<any>([]);
    const {scheduleMasterlist, loading, getScheduleMasterlist} = useScheduleMasterlistStore();

    useAsyncEffect(() => {        
        getScheduleMasterlist();
        if (scheduleMasterlist.length > 0) {
            const newDataset = scheduleMasterlist.map((data: any) => ({
                label: data.selection,
                value: data.selection,
                obj: data,
            }));
            setData(newDataset);
        }
    }, [scheduleMasterlist]);

    return (
        <SearchableDropDown
            label={label}
            placeholder={placeholder}
            name={name}
            onChange={onChange}
            error={error}
            value={value}
            loading={loading}
            options={data}
            required={required}
        />
    );
};

export default ScheduleMasterlistDropDown;