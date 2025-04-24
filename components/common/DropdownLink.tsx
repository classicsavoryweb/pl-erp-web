"use client";

import { DropdownRoute } from "@/constants/routes";
import * as Icons from "@mui/icons-material";
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';
import { useState } from "react";
import Link from "next/link";

interface DropDownInterface {
    route: DropdownRoute;
    isActive: boolean;
};

const DropdownLink = ({
    route,
    isActive
}: DropDownInterface) => {
    const IconComponent = Icons[route.icon as keyof typeof Icons];
    const [toggle, setToggle] = useState<boolean>(isActive);

    return (
        <div className={`relative ${toggle && "bg-red-300/10" } rounded-md overflow-hidden mt-1`}>
            <button
                className={`
                    w-full
                    flex
                    ${isActive ? "bg-red-600/70 text-slate-50 hover:cursor-default" : "hover:bg-red-300/20"}
                    rounded-md
                    p-3
                    justify-between
                    items-center
                    font-semibold
                    hover:cursor-pointer
                    text-gray-500
                    focus:outline-none
                `}

                onClick={() => {
                    setToggle(prev => !prev);
                }}
            >
                <div className="flex gap-2">
                    <IconComponent
                        style={{ width: '20px', height: '20px' }}
                    />
                    {route.name}
                </div>

                { toggle
                    ?
                    <ExpandLessOutlinedIcon
                        style={{ width: '25px', height: '25px' }}
                    />
                    :
                    <ExpandMoreOutlinedIcon
                        style={{ width: '25px', height: '25px' }}
                    />
                }
            </button>
            { toggle &&
                <div>
                    {route.subLinks.map((link, index) => {
                        return (
                            <Link
                                key={index}
                                href={link.pathname}
                                className={`
                                    w-full
                                    flex
                                    hover:bg-red-300/20
                                    rounded-md
                                    p-2
                                    items-center
                                    font-medium
                                    text-gray-500
                                    text-sm
                                    px-8
                                    focus:outline-none
                                `}
                            >
                                    <svg
                                        width="25"
                                        height="25"
                                        viewBox="0 0 25 25"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M4 4v10h10" stroke="currentColor" strokeWidth="1" />
                                    </svg>
                                    {link.name}
                            </Link>
                        )
                    })
                    }
                </div>
            }
        </div>
    );
};

export default DropdownLink;