"use client";

import { DropdownRoute } from "@/constants/routes";
import * as Icons from "@mui/icons-material";
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';
import { useContext, useState } from "react";
import Link from "next/link";
import { AuthContext } from "@/context/AuthProvider";
import { usePathname } from "next/navigation";
import SubDropDown from "./SubDropDown";

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
    const { permissions } = useContext(AuthContext);
    const pathName = usePathname();

    const hasVisibleSubLink = route.subLinks.some(
        (link) => (link.permission === "" && !link.isDropDown ) || permissions.includes(link.permission)
    );

    return (
        (route.permission === "" || permissions.includes(route.permission) || hasVisibleSubLink) &&
        <div className={`relative ${toggle && "bg-red-200/20" } rounded-md overflow-hidden mt-1`}>
            <button
                className={`
                    w-full
                    flex
                    ${isActive ? "bg-blue-950 text-slate-50 hover:cursor-default" : "hover:bg-blue-300/20"}
                    rounded-md
                    px-2
                    py-[10px]
                    justify-between
                    items-center
                    font-semibold
                    hover:cursor-pointer
                    text-gray-500
                    dark:text-slate-200
                    focus:outline-none
                    text-[11px]
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
                            <div key={index}>
                                { link.isDropDown
                                    ?
                                        <SubDropDown
                                            link={link}
                                            active={active}
                                        />
                                    :
                                    (permissions.includes(link.permission) || link.permission === "") &&
                                    <Link
                                        href={link.pathname}
                                        className={`
                                            w-full
                                            flex
                                            hover:bg-blue-300/20
                                            dark:text-slate-300
                                            rounded-md
                                            py-[7px]
                                            items-center
                                            font-medium
                                            text-[11px]
                                            px-2
                                            focus:outline-none
                                            ${active ? "text-blue-950" : "text-gray-500"}
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