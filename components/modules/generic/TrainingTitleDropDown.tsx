"use cient";

import { getOffenses } from "@/api/offenses";
import { getTrainingTitles } from "@/api/training-title";
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
    option: "Internal" | "External" | "";
}

const TrainingTitleDropDown = ({
    label,
    placeholder,
    name,
    onChange,
    error,
    value,
    required = false,
    option
}: SelectInterface) => {

    const api = useApiCall();

    useAsyncEffect(() => {
        api.setLoading(true);
        getTrainingTitles({
            option: option
        })
        .then((resp) => {
            if (!resp.error) {
                const newDataset = resp.data.training_titles.map((training: any) => {
                    return {
                        label: training.title,
                        value: training.id
                    };
                });
                api.setDataSet(newDataset);
            }
        })
        .finally(() => {
            api.setLoading(false);
        });
    }, [option]);

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

export default TrainingTitleDropDown;