"use cient";

import { getCoeReasons } from "@/api/coe-reason";
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
    disabled?:boolean;
}

const CoeReasonDropDown = ({
    label,
    placeholder,
    name,
    onChange,
    error,
    value,
    required = false,
    disabled = false
}: SelectInterface) => {

    const api = useApiCall();

    useAsyncEffect(() => {
        api.setLoading(true);
        getCoeReasons()
        .then((resp) => {
            if (!resp.error) {
                const newDataset = resp.data.coe_reasons.map((reason: any) => {
                    return {
                        label: reason.reason,
                        value: reason.reason
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
            disabled={disabled}
        />
    );
};

export default CoeReasonDropDown;