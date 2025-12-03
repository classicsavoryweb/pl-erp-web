"use client";

import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import { useEffect, useRef, useState } from 'react';

type ActionType = {
    label: string;
    onClick: () => void;
};

interface DropdownInterface {
    actions: ActionType[];
};

const DropDownButtons = ({
    actions,
}: DropdownInterface) => {

    const [toggle, setToggle] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
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
                 <div className="absolute flex flex-col items-start w-full z-50 bg-gray-200 shadow-lg dark:bg-neutral-800 dark:hover:text-gray-600">
                    {actions.map((action, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                action.onClick();
                                setToggle(false);
                            }}
                            className="py-2 px-3 hover:cursor-pointer border-b-1 border-slate-300 w-full text-left hover:bg-gray-300"
                        >
                            {action.label}
                        </button>
                    ))}
                </div>
            }
        </div>
    );
};

export default DropDownButtons;