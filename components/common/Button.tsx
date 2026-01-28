"use client";

import LoadingState from "./LoadingState";

interface ButtonInterface {
    label: string;
    onClick: () => void;
    loading?: boolean;
    type?: "button"|"submit";
    disabled?: boolean;
    variant?: "primary" | "secondary" | "success";
    callBack?: () => void; 
};

const Button = ({
    label,
    onClick,
    loading = false,
    type = "button",
    disabled = false,
    variant = "primary",
    callBack, 
}: ButtonInterface) => {

    const isDisabled = disabled || loading;
    const primary = `bg-red-800 text-slate-50 w-full px-3 h-[40px] rounded-md ${!isDisabled && "hover:bg-red-700 active:bg-red-800 hover:cursor-pointer"}`
    const secondary = `bg-gray-500 text-slate-50 w-full px-3 h-[40px] rounded-md ${!isDisabled && "hover:bg-gray-600 active:bg-gray-500 hover:cursor-pointer"}`
    const success = `bg-green-800 text-slate-50 w-full px-3 h-[40px] rounded-md ${!isDisabled && "hover:bg-green-900 active:bg-green-800 hover:cursor-pointer"}`

   
    const handleClick = () => {
        callBack?.();
        onClick(); 
    }

    return (
        <div className="w-full py-2">
            <button
                type={type}
                className={`
                    ${variant === "primary" && primary}
                    ${variant === "success" && success}
                    ${variant === "secondary" && secondary}
                    focus:outline-none
                    w-full
                    `
                }
                disabled={loading}
                onClick={handleClick}
            >
                <div className="flex justify-center items-center">
                    {loading ? <LoadingState/> : label }
                </div>
            </button>
        </div>
    );
};

export default Button;