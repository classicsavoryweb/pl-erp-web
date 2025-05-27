"use client";

import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import { useState } from 'react';

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

    return (
        <div className="relative min-w-[150px] py-2">
            <button
                className="bg-gray-200 w-full py-2 px-3 hover:cursor-pointer flex justify-between items-center gap-x-1 text-sm"
                onClick={() => setToggle(prev => !prev)}
            >
                Actions
                <ExpandMoreOutlinedIcon
                    className={`text-gray-500`}
                    style={{ width: '20px', height: '20px' }}
                />
            </button>
            
            { toggle &&
                 <div className="absolute flex flex-col items-start w-full z-50 bg-gray-200 shadow-lg">
                    {actions.map((action, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                action.onClick();
                                setToggle(false);
                            }}
                            className="py-2 px-3 hover:cursor-pointer border-b-1 border-slate-300 w-full text-left text-sm hover:bg-gray-300"
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