"use client";

import { SubLink } from "@/constants/routes";
import { useContext, useState } from "react";
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthContext } from "@/context/AuthProvider";

interface DropDownInterface {
    link: SubLink;
    active: boolean;
};

const SubDropDown = ({
    link,
    active = false
}: DropDownInterface) => {

    const [subToggle, setSubToggle] = useState<boolean>(active);
    const pathName = usePathname();
    const { permissions } = useContext(AuthContext);
    const isShowing = link?.subLinks?.some(subLink =>
        permissions?.includes(subLink.permission)
    );

    return (
        isShowing &&
        <>
            <button
                className={`
                    w-full
                    flex
                    hover:bg-red-300/20
                    rounded-md
                    py-[7px]
                    items-center
                    text-[11px]
                    px-2
                    focus:outline-none
                    hover:cursor-pointer
                    dark:text-slate-300
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

                <div className="flex flex-grow items-center justify-between">
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

            { (subToggle) &&
                <div>
                    { link.subLinks?.map((link, index) => {
                        const subActive = link.pathname === pathName;

                        return (
                            (permissions.includes(link.permission) || link.permission === "") &&
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
                                        text-[11px]
                                        px-8
                                        focus:outline-none
                                        dark:text-slate-300
                                        ${subActive ? "text-red-800 dark:text-red-500" : "text-gray-500"}
                                    `}
                                >
                                        <svg
                                            width="22"
                                            height="22"
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
    )
};

export default SubDropDown;