"use client";

import { getAllRoles } from "@/api/roles-and-permissions";
import CheckboxGroup from "@/components/common/CheckboxGroup";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";

interface SelectInterface {
    label: string;
    error?: string;
    value: (string | number)[];
    onChange: (value: (string | number)[]) => void;
    required?: boolean;
}

const RolesMultiSelect = ({
    label,
    error,
    value,
    onChange,
    required = false
}: SelectInterface) => {

    const roles = useApiCall();

    useAsyncEffect(() => {
        roles.setLoading(true);
        getAllRoles()
        .then((resp) => {
            if (!resp.error) {
                const newSetOfRoles = resp.data.roles.map((role: any) => {
                    return {
                        label: role.name,
                        value: role.id
                    };
                });
                roles.setDataSet(newSetOfRoles);
            }
        })
        .finally(() => {
            roles.setLoading(false);
        });
    }, []);

    return (
        <CheckboxGroup
            label={label}
            error={error}
            value={value}
            onChange={onChange}
            loading={roles.loading}
            options={roles.dataSet}
            required={required}
        />
    );
};

export default RolesMultiSelect;
