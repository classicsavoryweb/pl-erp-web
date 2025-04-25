import { getAllRoles } from "@/api/roles-and-permissions";
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

const RolesDropDown = ({
    label,
    placeholder,
    name,
    onChange,
    error,
    value,
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
        <Dropdown
            label={label}
            placeholder={placeholder}
            name={name}
            onChange={onChange}
            error={error}
            value={value}
            loading={roles.loading}
            options={roles.dataSet}
            required={required}
        />
    );
};

export default RolesDropDown;