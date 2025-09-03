"use client";

import { AuthContext } from '@/context/AuthProvider';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import { useEffect, useRef, useState, useContext } from 'react';

type ActionType = {
    label: string;
    onClick: (data: any) => void;
    permission?: string;
};

interface DropdownInterface {
    actions: ActionType[];
    data: any;
};

const ActionDropDown = ({
    actions,
    data
}: DropdownInterface) => {

    const [toggle, setToggle] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { permissions } = useContext(AuthContext);

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
        <div ref={dropdownRef} className="w-[115px] py-1">
            <button
                className="bg-gray-200 w-full py-1 px-2 hover:cursor-pointer flex justify-between items-center gap-x-1 text-sm"
                onClick={() => setToggle(prev => !prev)}
            >
                Action
                <ExpandMoreOutlinedIcon
                    className={`text-gray-500`}
                    style={{ width: '20px', height: '20px' }}
                />
            </button>
            
            { toggle &&
                 <div
                    className="absolute flex flex-col items-start w-[115px] z-50 bg-gray-200 shadow-lg"
                >
                    {actions.map((action, idx) => {
                        let render = true;

                        if (action.permission) {
                            if (!permissions.includes(action.permission)) {
                                render = false;
                            }
                        }

                        if (render) {
                            return (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        action.onClick(data);
                                        setToggle(false);
                                    }}
                                    className="py-1 px-2 hover:cursor-pointer border-b-1 border-slate-300 w-full text-left text-sm hover:bg-gray-300"
                                >
                                    {action.label}
                                </button>
                            );
                        }
                    })}
                </div>
            }
        </div>
    );
};

export default ActionDropDown;