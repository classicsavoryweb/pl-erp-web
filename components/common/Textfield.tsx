"use client"

import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

interface TextfieldInterface {
    label: string;
    placeholder?: string;
    name: string;
    onChange: (e: any) => void;
    error?: string;
    value?: string;
    type?: "text" | "email" | "date" | "password" | "file";
    required?: boolean;
    disabled?: boolean;
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
}: TextfieldInterface) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

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
                    onChange={onChange}
                    disabled={disabled}
                    className={`
                        w-full h-[40px] rounded-md focus:outline-none border-2 ${error ? "border-red-400" : "border-slate-300 focus:border-slate-400"} p-2
                        ${disabled ? "hover:cursor-not-allowed" : ""}
                    `}
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
