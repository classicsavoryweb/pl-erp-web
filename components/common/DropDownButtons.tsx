"use client";

import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '@/context/AuthProvider';

type ActionType = {
    label: string;
    onClick: () => void;
    permission?: string | string[];
    disabled?: boolean;
};

interface DropdownInterface {
    actions: ActionType[];
};

const DropDownButtons = ({
    actions,
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
        <div ref={dropdownRef} className="relative min-w-[150px] py-2">
            <button
                className="bg-gray-200 w-full py-2 px-3 hover:cursor-pointer flex justify-between items-center gap-x-1 dark:bg-neutral-800 dark:text-slate-300"
                onClick={() => setToggle(prev => !prev)}
            >
                Actions
                <ExpandMoreOutlinedIcon
                    className={`text-gray-500`}
                    style={{ width: '20px', height: '20px' }}
                />
            </button>
            
            { toggle &&
                 <div className="absolute flex flex-col items-start w-full z-50 bg-gray-200 shadow-lg dark:bg-neutral-800">
                    {availableActions.map((action, idx) => {
                        const isDisabled = action.disabled === true;

                        return (
                            <button
                                key={idx}
                                disabled={isDisabled}
                                onClick={() => {
                                    if (isDisabled) return;
                                    action.onClick();
                                    setToggle(false);
                                }}
                                className={`
                                    py-2 px-3 border-b-1 border-slate-300 w-full text-left
                                    ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:cursor-pointer hover:bg-gray-300"}
                                    dark:hover:text-gray-600 dark:border-neutral-700
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

export default DropDownButtons;
