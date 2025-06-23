interface SelectInterface {
    label: string;
    placeholder?: string;
    name: string;
    onChange: (e: any) => void;
    error?: string;
    value?: string;
    required?: boolean;
    options: {
        label: string;
        value: string;
    }[];
    loading?: boolean;
    disabled?: boolean;
}

const Dropdown = ({
    label,
    placeholder,
    name,
    onChange,
    error,
    value,
    required,
    options,
    loading = false,
    disabled = false,
}: SelectInterface) => {
    return (
        <div className="relative py-1">
            <p className="mb-[-2px]">
                {label}
                {required && <span className="text-red-400">*</span>}
            </p>
            <div className="relative">
                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className={`
                        w-full h-[40px] rounded-md focus:outline-none border-2 ${error ? "border-red-400" : "border-slate-300 focus:border-slate-400"} p-2
                        ${disabled ? "hover:cursor-not-allowed bg-gray-100" : ""}
                    `}
                >
                    <option disabled value="">{loading ? "loading..." :placeholder}</option>

                    { options.map((option, key) => {
                        return (
                            <option
                                key={key}
                                value={option.value}
                            >
                                {option.label}
                            </option>
                        )
                    })

                    }
                </select>
            </div>
            {error && <p className="text-red-400">{error}</p>}
        </div>
    );
};

export default Dropdown;