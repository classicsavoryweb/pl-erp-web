"use cient";

import { getCategories, getSubCategories } from "@/api/offenses";
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

const SubCategoryDropDown = ({
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
        getSubCategories()
        .then((resp) => {
            if (!resp.error) {
                const newDataset = resp.data.categories.map((role: any) => {
                    return {
                        label: role.name,
                        value: role.name
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

export default SubCategoryDropDown;