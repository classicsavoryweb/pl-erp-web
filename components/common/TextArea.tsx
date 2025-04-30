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
    required?: boolean;
    disabled?: boolean;
}

const TextArea = ({
    label,
    placeholder,
    name,
    onChange,
    error,
    value,
    required = false,
    disabled = false,
}: TextfieldInterface) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative py-1">
            <p className="mb-[-2px]">
                {label}
                {required && <span className="text-red-400">*</span>}
            </p>
            <div className="relative">
                <textarea
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className={`w-full h-[150px] rounded-md focus:outline-none border-2 ${error ? "border-red-400" : "border-slate-300 focus:border-slate-400"} p-2 pr-10`}
                ></textarea>
            </div>
            {error && <p className="text-red-400 mt-[-5px]">{error}</p>}
        </div>
    );
};

export default TextArea;
