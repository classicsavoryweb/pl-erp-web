"use cient";

import { getVaccines } from "@/api/vaccines";
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

const VaccineBrandDropDown = ({
    label,
    placeholder,
    name,
    onChange,
    error,
    value,
    required = false,
}: SelectInterface) => {

    const api = useApiCall();

    useAsyncEffect(() => {
        api.setLoading(true);
        getVaccines()
        .then((resp) => {
            if (!resp.error) {
                const newDataset = resp.data.vaccines.map((vaccine: any) => {
                    return {
                        label: vaccine.description,
                        value: vaccine.id
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

export default VaccineBrandDropDown;