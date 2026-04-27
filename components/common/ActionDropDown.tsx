"use client";

import { AuthContext } from '@/context/AuthProvider';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import { useEffect, useRef, useState, useContext } from 'react';

type ActionType = {
    label: string;
    onClick: (data: any) => void;
    permission?: string | string[];
    disabled?: boolean;
};

interface DropdownInterface {
    actions: ActionType[];
    data: any;
    label?: string;
    direct?: boolean;
    containerClassName?: string;
};

const ActionDropDown = ({
    actions,
    data,
    label = "Action",
    direct = false,
    containerClassName,
}: DropdownInterface) => {

    const [toggle, setToggle] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { permissions } = useContext(AuthContext);
    const availableActions = actions.filter((action) => {
        if (!action.permission) return true;
        if (Array.isArray(action.permission)) {
            return action.permission.some((permission) => permissions.includes(permission));
        }
        return permissions.includes(action.permission);
    });
    const primaryAction = availableActions[0];
    const isDirect = direct === true;
    const isDisabled = isDirect && (!primaryAction || primaryAction.disabled);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setToggle(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div ref={dropdownRef} className={containerClassName ?? "w-[115px]"}>
            <button
                type="button"
                className={`
                    bg-gray-200 w-full py-1 px-2 flex justify-between items-center gap-x-1 dark:bg-neutral-900 dark:text-slate-300
                    ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:cursor-pointer"}
                `}
                onClick={() => {
                    if (isDisabled) return;
                    if (isDirect) {
                        primaryAction && primaryAction.onClick(data);
                        return;
                    }
                    setToggle(prev => !prev);
                }}
                disabled={isDisabled}
            >
                {label}
                {!isDirect &&
                    <ExpandMoreOutlinedIcon
                        className={`text-gray-500`}
                        style={{ width: '20px', height: '20px' }}
                    />
                }
            </button>
            
            { (!isDirect && toggle) &&
                <div
                    className="absolute flex flex-col items-start w-[115px] z-50 bg-gray-200 shadow-lg"
                >
                    {availableActions.map((action, idx) => {
                        const actionDisabled = action.disabled === true;

                        return (
                            <button
                                key={idx}
                                disabled={actionDisabled}
                                onClick={() => {
                                    if (actionDisabled) return;
                                    action.onClick(data);
                                    setToggle(false);
                                }}
                                className={`
                                    py-1 px-2 border-b-1 border-slate-300 w-full text-left
                                    ${actionDisabled ? "opacity-50 cursor-not-allowed" : "hover:cursor-pointer hover:bg-gray-300"}
                                    dark:bg-neutral-900 dark:text-slate-300 dark:border-neutral-700 dark:hover:text-gray-600
                                `}
                            >
                                {action.label}
                            </button>
                        );
                    })}
                </div>
            }
        </div>
    );
};

export default ActionDropDown;
