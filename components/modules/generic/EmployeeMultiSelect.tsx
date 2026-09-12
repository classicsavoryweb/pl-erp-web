"use client";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import SearchEmployeeDropDown from "@/components/modules/generic/SearchEmployeeDropDown";

interface Employee {
    id: number | string;
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    proper_full_name?: string;
    full_name?: string;
    employee_number?: string;
    [key: string]: any;
}

interface EmployeeMultiSelectProps {
    label?: string;
    placeholder?: string;
    value: Employee[];
    onChange: (employees: Employee[]) => void;
    required?: boolean;
    error?: string;
    status?: "active" | "inactive" | "all";
    disabled?: boolean;
    emptyLabel?: string;
}

const employeeLabel = (employee: Employee) =>
    employee.proper_full_name
    ?? employee.full_name
    ?? [employee.last_name, employee.first_name].filter(Boolean).join(", ")
    ?? "Unknown";

const EmployeeMultiSelect = ({
    label = "Employees",
    placeholder = "search and select employee",
    value,
    onChange,
    required = false,
    error,
    status = "active",
    disabled = false,
    emptyLabel = "No employee selected yet",
}: EmployeeMultiSelectProps) => {
    const handleSelect = (event: any) => {
        const employee = event.target.value;
        if (!employee) return;

        const alreadySelected = value.some((selected) => selected.id === employee.id);
        if (alreadySelected) return;

        onChange([...value, employee]);
    };

    const handleRemove = (employeeId: number | string) => {
        onChange(value.filter((selected) => selected.id !== employeeId));
    };

    return (
        <div>
            <SearchEmployeeDropDown
                label={label}
                placeholder={placeholder}
                name="employee_multi_select"
                value={null}
                status={status}
                required={required}
                disabled={disabled}
                onChange={handleSelect}
            />
            <div
                className={`mt-1 flex min-h-[46px] flex-wrap items-center gap-2 rounded-md border-2 p-2 transition-colors
                    ${error ? "border-red-400" : "border-slate-300 dark:border-neutral-700"}
                    ${disabled ? "bg-gray-100 dark:bg-neutral-900" : ""}
                `}
            >
                {value.length === 0 ? (
                    <span className="text-sm text-slate-400">{emptyLabel}</span>
                ) : (
                    value.map((employee) => (
                        <span
                            key={employee.id}
                            className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-3 pr-2 text-xs font-medium text-slate-700 shadow-sm dark:border-neutral-600 dark:bg-neutral-800 dark:text-slate-100"
                        >
                            {employeeLabel(employee)}
                            {!disabled && (
                                <button
                                    type="button"
                                    aria-label={`Remove ${employeeLabel(employee)}`}
                                    className="flex h-4 w-4 items-center justify-center rounded-full text-slate-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/40"
                                    onClick={() => handleRemove(employee.id)}
                                >
                                    <CloseOutlinedIcon style={{ width: 12, height: 12 }} />
                                </button>
                            )}
                        </span>
                    ))
                )}
            </div>
            {value.length > 0 && (
                <p className="mt-1 text-xs text-slate-400">
                    {value.length} employee{value.length > 1 ? "s" : ""} selected
                </p>
            )}
            {error && <p className="text-red-400">{error}</p>}
        </div>
    );
};

export default EmployeeMultiSelect;
