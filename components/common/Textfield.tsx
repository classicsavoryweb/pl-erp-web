"use client"

import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

interface TextfieldInterface {
    label: string;
    placeholder?: string;
    name?: string;
    onChange?: (e: any) => void;
    error?: string;
    value?: string;
    type?: "text" | "email" | "date" | "password" | "file" | "number" | "time" | "datetime-local";
    required?: boolean;
    disabled?: boolean;
    isUpperCase?: boolean;
}

const Textfield = ({
    label,
    placeholder,
    name,
    onChange,
    error,
    type = "text",
    value,
    required = false,
    disabled = false,
    isUpperCase = false,
}: TextfieldInterface) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const timeAttributes = type === "time" ? { step: 60, min: "00:00", max: "23:59" } : {};

    return (
        <div className="relative py-1">
            <p className="mb-[-2px]">
                {label}
                {required && <span className="text-red-400">*</span>}
            </p>
            <div className="relative">
                <input
                    type={isPassword && showPassword ? "text" : type}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => {
                        if (isUpperCase) {
                            const newValue = isUpperCase ? e.target.value.toUpperCase() : e.target.value;
                            onChange?.({ target: { name, value: newValue } });
                        } else {
                            onChange?.(e);
                        }
                    }}
                    disabled={disabled}
                    className={`
                        w-full h-[40px] rounded-md focus:outline-none border-2 ${error ? "border-red-400" : "border-slate-300 focus:border-slate-400"} p-2
                        ${disabled ? "hover:cursor-not-allowed bg-gray-100" : "cursor-text"}
                        ${isUpperCase ? "uppercase placeholder:normal-case" : ""}
                    `}

                    {...timeAttributes}
                />
                {isPassword && (
                    <div
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                        onClick={() => setShowPassword(prev => !prev)}
                    >
                        {showPassword ? (
                            <VisibilityOffIcon style={{ fontSize: 20 }} />
                        ) : (
                            <VisibilityIcon style={{ fontSize: 20 }} />
                        )}
                    </div>
                )}
            </div>
            {error && <p className="text-red-400">{error}</p>}
        </div>
    );
};

export default Textfield;
