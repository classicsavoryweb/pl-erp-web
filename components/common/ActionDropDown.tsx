"use client";

import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import { useState } from 'react';

type ActionType = {
    label: string;
    onClick: (data: any) => void;
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

    return (
        <div className="relative w-[100px] py-1">
            <button
                className="bg-gray-200 w-full py-1 px-3 hover:cursor-pointer flex justify-between items-center gap-x-1 text-sm"
                onClick={() => setToggle(prev => !prev)}
            >
                Action
                <ExpandMoreOutlinedIcon
                    className={`text-gray-500`}
                    style={{ width: '20px', height: '20px' }}
                />
            </button>
            
            { toggle &&
                 <div className="absolute flex flex-col items-start w-full z-50 bg-gray-200 shadow-md">
                    {actions.map((action, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                action.onClick(data);
                                setToggle(false);
                            }}
                            className="py-1 px-3 hover:cursor-pointer border-b-1 border-slate-300 w-full text-left text-sm hover:bg-gray-300"
                        >
                            {action.label}
                        </button>
                    ))}
                </div>
            }
        </div>
    );
};

export default ActionDropDown;