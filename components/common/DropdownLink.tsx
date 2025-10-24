"use client";

import { DropdownRoute } from "@/constants/routes";
import * as Icons from "@mui/icons-material";
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';
import { useContext, useState } from "react";
import Link from "next/link";
import { AuthContext } from "@/context/AuthProvider";
import { usePathname } from "next/navigation";

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
    const [subToggle, setSubToggle] = useState<boolean>(false);
    const { permissions } = useContext(AuthContext);
    const pathName = usePathname();

    return (
        (route.permission === "" || permissions.includes(route.permission)) &&
        <div className={`relative ${toggle && "bg-red-200/20" } rounded-md overflow-hidden mt-1`}>
            <button
                className={`
                    w-full
                    flex
                    ${isActive ? "bg-red-800 text-slate-50 hover:cursor-default" : "hover:bg-red-300/20"}
                    rounded-md
                    px-3
                    py-[10px]
                    justify-between
                    items-center
                    font-semibold
                    hover:cursor-pointer
                    text-gray-500
                    focus:outline-none
                    text-sm
                `}

                onClick={() => {
                    setToggle(prev => !prev);
                }}
            >
                <div className="flex gap-2">
                    <IconComponent
                        style={{ width: '19px', height: '19px' }}
                    />
                    {route.name}
                </div>

                { toggle
                    ?
                    <ExpandLessOutlinedIcon
                        style={{ width: '19px', height: '19px' }}
                    />
                    :
                    <ExpandMoreOutlinedIcon
                        style={{ width: '19px', height: '19px' }}
                    />
                }
            </button>
            { toggle &&
                <div>
                    {route.subLinks.map((link, index) => {
                        const active = pathName.startsWith(link.pathname + '/') || pathName === link.pathname;

                        return (
                            (permissions.includes(link.permission) || link.permission === "") &&
                            <div key={index}>
                                { link.isDropDown
                                    ?
                                        <>
                                            <button
                                                className={`
                                                    w-full
                                                    flex
                                                    hover:bg-red-300/20
                                                    rounded-md
                                                    py-[7px]
                                                    items-center
                                                    font-medium
                                                    text-[13px]
                                                    px-3
                                                    focus:outline-none
                                                    hover:cursor-pointer
                                                    ${active ? "text-red-800" : "text-gray-500"}
                                                `}

                                                onClick={() => {
                                                    setSubToggle(prev => !prev);
                                                }}
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

                                                <div className="w-full flex items-center justify-between">
                                                    <div>
                                                        {link.name}
                                                    </div>
                                                    { subToggle
                                                        ?
                                                        <ExpandLessOutlinedIcon
                                                            style={{ width: '19px', height: '19px' }}
                                                        />
                                                        :
                                                        <ExpandMoreOutlinedIcon
                                                            style={{ width: '19px', height: '19px' }}
                                                        />
                                                    }
                                                </div>
                                            </button>

                                            { (subToggle || active) &&
                                                <div>
                                                    { link.subLinks?.map((link, index) => {
                                                        const subActive = link.pathname === pathName;

                                                        return (
                                                            <div key={index}>
                                                                <Link
                                                                    href={link.pathname}
                                                                    className={`
                                                                        w-full
                                                                        flex
                                                                        hover:bg-red-300/20
                                                                        rounded-md
                                                                        py-[7px]
                                                                        items-center
                                                                        font-medium
                                                                        text-[13px]
                                                                        px-7
                                                                        focus:outline-none
                                                                        ${subActive ? "text-red-800" : "text-gray-500"}
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
                                                            </div>
                                                        )
                                                    })
                                                    }
                                                </div>
                                            }
                                        </>
                                    :
                                    <Link
                                        href={link.pathname}
                                        className={`
                                            w-full
                                            flex
                                            hover:bg-red-300/20
                                            rounded-md
                                            py-[7px]
                                            items-center
                                            font-medium
                                            text-[13px]
                                            px-3
                                            focus:outline-none
                                            ${active ? "text-red-800" : "text-gray-500"}
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
                                }
                                {link.break && <div className="px-6"><hr className="text-gray-300"/></div> }
                            </div>
                        )
                    })
                    }
                </div>
            }
        </div>
    );
};

export default DropdownLink;