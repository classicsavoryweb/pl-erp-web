"use client";

import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '@/api/authentication';
import Cookies from 'js-cookie';
import { AuthContext } from '@/context/AuthProvider';

const Header = () => {
    const [toggle, setToggle] = useState<boolean>(false);
    const router = useRouter();
    const { userDetails } = useContext(AuthContext);

    return (
        <div className="relative">
            { Object.values(userDetails).some((value) => value !== "") &&
                <div
                    className={`flex items-center py-2 px-3 bg-red-600/70 ${toggle ? "rounded-t-xl" : "rounded-3xl"} cursor-pointer focus:outline-none`}
                    onClick={() => {
                        setToggle(prev => !prev);
                    }}
                >
                    <PersonOutlineOutlinedIcon
                        className={` text-slate-50 mr-3`}
                        style={{ width: '25px', height: '25px' }}
                    />
                    <p
                        className={`text-slate-50 font-semibold font-poppins mr-3 mt-0.5`}
                    >
                        {`${userDetails.employee_number} - ${userDetails.last_name}, ${userDetails.first_name}`}
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
                <div className="absolute w-full bg-white rounded-b-xl shadow-lg py-2 z-50 overflow-hidden">
                    <p
                        className="px-4 py-2 text-gray-700 flex items-center hover:bg-gray-100 cursor-pointer"
                        onClick={() => {router.push("/change-password")}}
                    >
                        <LockOpenOutlinedIcon
                            className={`mr-3`}
                            style={{ width: '16px', height: '16px' }}
                        />
                        Change Password
                    </p>
                    <p
                        className="px-4 py-2 text-gray-700 flex items-center hover:bg-gray-100 cursor-pointer"
                        onClick={ async () => {
                            await logout();
                            Cookies.remove('authToken');
                            Cookies.remove('permissions');
                            Cookies.remove('userDetails');
                            router.push('/login');
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