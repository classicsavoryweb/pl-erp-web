"use client";

import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import { useState, useContext, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '@/api/authentication';
import Cookies from 'js-cookie';
import { AuthContext } from '@/context/AuthProvider';
import { toast } from 'react-toastify';
import { useTheme } from "next-themes";
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';

const Header = () => {
    const [toggle, setToggle] = useState<boolean>(false);
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const { userDetails } = useContext(AuthContext);
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
        <div className="relative" ref={dropdownRef}>
            { Object.values(userDetails).some((value) => value !== "") &&
                <div
                    className={`flex items-center py-2 px-3 bg-zinc-100/10 ${toggle ? "rounded-t-3xl" : "rounded-3xl"} cursor-pointer focus:outline-none`}
                    onClick={() => {
                        setToggle(prev => !prev);
                    }}
                >
                    <PersonOutlineOutlinedIcon
                        className={` text-slate-50 mr-3`}
                        style={{ width: '25px', height: '25px' }}
                    />
                    <p
                        className={`text-slate-50 min-w-[140px] font-semibold font-poppins mr-3 mt-0.5 `}
                    >
                        {`${userDetails.employee_number} - ${userDetails.last_name}`}
                    </p>
                    
                    { toggle
                        ?
                        <ExpandLessOutlinedIcon
                            className={`text-slate-50`}
                            style={{ width: '25px', height: '25px' }}
                        />
                        :
                        <ExpandMoreOutlinedIcon
                            className={`text-slate-50`}
                            style={{ width: '25px', height: '25px' }}
                        />
                    }
                </div>
            }

            {toggle && (
                <div className="absolute w-full bg-zinc-50 dark:bg-neutral-800 dark:text-slate-200 rounded-b-3xl shadow-lg py-2 z-50 overflow-hidden">
                    <p
                        className="px-4 py-2 flex items-center hover:bg-gray-100 dark:hover:text-gray-600 cursor-pointer "
                        onClick={() => {router.push("/change-password")}}
                    >
                        <LockOpenOutlinedIcon
                            className={`mr-3`}
                            style={{ width: '16px', height: '16px' }}
                        />
                        Change Password
                    </p>
                    <p
                        className="px-4 py-2 flex items-center hover:bg-gray-100 cursor-pointer text-sm dark:hover:text-gray-600"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    >
                        { theme === "dark"
                            ?
                            <>
                                <DarkModeOutlinedIcon
                                    className={`mr-3`}
                                    style={{ width: '16px', height: '16px' }}
                                />

                                Light Mode
                            </>
                            :
                            <>
                                <LightModeOutlinedIcon
                                    className={`mr-3`}
                                    style={{ width: '16px', height: '16px' }}
                                />
                                Dark Mode
                            </>
                        }
                    </p>
                    <p
                        className="px-4 py-2 flex items-center hover:bg-gray-100 cursor-pointer dark:hover:text-gray-600"
                        onClick={async () => {
                            await logout();
                            Cookies.remove('authToken');
                            Cookies.remove('userDetails');
                            let index = 0;
                            while (Cookies.get(`permissions_${index}`)) {
                                Cookies.remove(`permissions_${index}`);
                                index++;
                            }
                            router.push('/login');
                            toast.success("Logged out successfully");
                        }}
                    >
                        <LogoutOutlinedIcon
                            className={`mr-3`}
                            style={{ width: '16px', height: '16px' }}
                        />
                        Logout
                    </p>
                </div>
            )}

            
        </div>
    );
};

export default Header;