import Checkbox from "./Checkbox";
import Grid from "./Grid";

interface CheckboxGroupInterface {
    label: string;
    error?: string;
    required?: boolean;
    loading?: boolean;
    cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    options: {
        label: string;
        value: string | number;
    }[];
    value: (string | number)[];
    onChange: (value: (string | number)[]) => void;
}

const CheckboxGroup = ({
    label,
    error,
    required = false,
    loading = false,
    cols = 3,
    options,
    value,
    onChange,
}: CheckboxGroupInterface) => {
    return (
        <div className="relative py-1">
            <p className="mb-[-2px]">
                {label}
                {required && <span className="text-red-400">*</span>}
            </p>
            <div className={`max-h-[250px] overflow-y-auto rounded-md border-2 p-2 ${error ? "border-red-400" : "border-slate-300"} dark:border-neutral-700`}>
                {loading
                    ? <p className="text-xs text-slate-400">loading...</p>
                    : (
                        <Grid cols={cols}>
                            {options.map((option) => {
                                const isChecked = value.includes(option.value);

                                return (
                                    <Checkbox
                                        key={option.value}
                                        label={option.label}
                                        value={option.value}
                                        checked={isChecked}
                                        onChange={() => {
                                            if (isChecked) {
                                                onChange(value.filter((id) => id !== option.value));
                                            } else {
                                                onChange([...value, option.value]);
                                            }
                                        }}
                                    />
                                );
                            })}
                        </Grid>
                    )
                }
            </div>
            {error && <p className="text-red-400">{error}</p>}
        </div>
    );
};

export default CheckboxGroup;
