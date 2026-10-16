"use client";

import LoadingState from "./LoadingState";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';

interface ButtonInterface {
    label: string;
    onClick: () => void;
    loading?: boolean;
    type?: "button"|"submit";
    disabled?: boolean;
    variant?: "primary" | "secondary" | "success";
    isIcon?: boolean;
    iconType?: "search" | "export" | "reset" | "print";
    combineIconWithLabel?: boolean;
};

const Button = ({
    label,
    onClick,
    loading = false,
    type = "button",
    disabled = false,
    variant = "primary",
    isIcon = false,
    iconType = "search",
    combineIconWithLabel = false
}: ButtonInterface) => {

    const isDisabled = disabled || loading;
    const primary = `bg-blue-950 text-slate-50 w-full px-3 h-[40px] rounded-md ${!isDisabled && "hover:bg-blue-900 active:bg-blue-950 hover:cursor-pointer"}`;
    const secondary = `bg-gray-500 text-slate-50 w-full px-3 h-[40px] rounded-md ${!isDisabled && "hover:bg-gray-600 active:bg-gray-500 hover:cursor-pointer"}`;
    const success = `bg-green-800 text-slate-50 w-full px-3 h-[40px] rounded-md ${!isDisabled && "hover:bg-green-900 active:bg-green-800 hover:cursor-pointer"}`;
    let icon = <SearchOutlinedIcon/>;

    if (isIcon) {
        switch (iconType) {
            case "search":
                icon = <SearchOutlinedIcon/>;
                break;
            case "export":
                icon = <FileDownloadOutlinedIcon/>;
                break;
            case "reset":
                icon = <RestartAltOutlinedIcon/>;
                break;
            case "print":
                icon = <LocalPrintshopOutlinedIcon/>;
                break;
            default:
                icon = <></>;
                break;
        };
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
                disabled={isDisabled}
                onClick={onClick}
            >
                <div className="flex justify-center gap-x-1 items-center">
                    {
                        loading ?
                        <LoadingState/>
                        : !isIcon
                        ? label
                        : icon
                    }
                    { combineIconWithLabel && label }
                </div>
            </button>
        </div>
    );
};

export default Button;