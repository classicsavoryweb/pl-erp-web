import Dropdown from "@/components/common/Dropdown";

interface Props {
    label: string;
    name: string;
    onChange: (e: any) => void;
    error?: string;
    value?: string;
    required?: boolean;
}

const UniformPeriodLockStatusDropDown = ({
    label,
    name,
    onChange,
    error,
    value,
    required = false,
}: Props) => {
    return (
        <Dropdown
            label={label}
            name={name}
            value={value}
            onChange={onChange}
            error={error}
            required={required}
            options={[
                {
                    label: "Open",
                    value: "active",
                },
                {
                    label: "Lock",
                    value: "inactive",
                },
            ]}
        />
    );
};

export default UniformPeriodLockStatusDropDown;
