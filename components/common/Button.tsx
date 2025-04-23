"use client";

import LoadingState from "./LoadingState";

interface ButtonInterface {
    label: string;
    onClick: () => void;
    loading?: boolean;
    type?: "button"|"submit";
    disabled?: boolean;
};

const Button = ({
    label,
    onClick,
    loading = false,
    type = "button",
    disabled = false,
}: ButtonInterface) => {

    const isDisabled = disabled || loading;

    return (
        <div className="relative py-2">
            <button
                type={type}
                className={`bg-red-600 text-slate-50 w-full h-[40px] rounded-md ${!isDisabled && "hover:bg-red-700 active:bg-red-600 hover:cursor-pointer"} focus:outline-none`}
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