"use client";

import LoadingState from "./LoadingState";

interface ButtonInterface {
    label: string;
    onClick: () => void;
    loading?: boolean;
    type?: "button"|"submit";
    disabled?: boolean;
    variant?: "primary" | "secondary";
};

const Button = ({
    label,
    onClick,
    loading = false,
    type = "button",
    disabled = false,
    variant = "primary"
}: ButtonInterface) => {

    const isDisabled = disabled || loading;
    const primary = `bg-red-600 text-slate-50 w-full px-3 h-[40px] rounded-md ${!isDisabled && "hover:bg-red-700 active:bg-red-600 hover:cursor-pointer"}`
    const secondary = `bg-gray-500 text-slate-50 w-full px-3 h-[40px] rounded-md ${!isDisabled && "hover:bg-gray-600 active:bg-gray-500 hover:cursor-pointer"}`

    return (
        <div className="w-full py-2">
            <button
                type={type}
                className={`
                    ${variant === "primary" && primary}
                    ${variant === "secondary" && secondary}
                    focus:outline-none
                    w-full
                    `
                }
                disabled={loading}
                onClick={onClick}
            >
                <div className="flex justify-center items-center">
                    {loading ? <LoadingState/> : label }
                </div>
            </button>
        </div>
    );
};

export default Button;