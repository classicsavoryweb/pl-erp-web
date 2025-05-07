"use client";

import { routes } from "@/constants/routes";
import * as Icons from "@mui/icons-material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DropdownLink from "../common/DropdownLink";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthProvider";

const Sidebar = () => {
    const pathName = usePathname();
    const { permissions } = useContext(AuthContext);

    return (
        <div className="relative mt-5 px-3">
            {routes.map((route, index) => {
                const IconComponent = Icons[route.icon as keyof typeof Icons];
                if (route.type === "link") {

                    const isActive = pathName === route.pathname;
                    return (
                        (route.permission === "" || permissions.includes(route.permission)) &&         
                        <Link
                            key={index}
                            href={route.pathname}
                            className={`
                                w-full
                                flex
                                gap-2
                                ${isActive ? "bg-red-800 text-slate-50 hover:cursor-default" : "hover:bg-red-300/20"}
                                rounded-md
                                p-3
                                flex
                                items-center
                                gap-2
                                mt-1
                                font-semibold
                                text-gray-500
                                focus:outline-none
                                text-sm
                            `}
                        >
                            <IconComponent
                                style={{ width: '20px', height: '20px' }}
                            />
                            {route.name}
                        </Link>
                    )
                } else {
                    const isActive = pathName.startsWith(route.basepath);
                    return (
                        <DropdownLink
                            key={index}
                            route={route}
                            isActive={isActive}
                        />
                    );
                }
            })}
        </div>
    );
};

export default Sidebar;