"use client";

import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import { useState, useContext, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '@/api/authentication';
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '@/api/notifications';
import Cookies from 'js-cookie';
import { AuthContext } from '@/context/AuthProvider';
import { toast } from 'react-toastify';
import { useTheme } from "next-themes";
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';

interface NotificationItem {
    id: number;
    message: string;
    is_read: boolean;
    created_at: string;
}

const Header = () => {
    const [toggle, setToggle] = useState<boolean>(false);
    const [notificationOpen, setNotificationOpen] = useState<boolean>(false);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const { userDetails } = useContext(AuthContext);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const isLoggedIn = Object.values(userDetails).some((value) => value !== "");

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setToggle(false);
                setNotificationOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, []);

    const loadNotifications = useCallback(async () => {
        if (!isLoggedIn) {
            return;
        }

        setIsRefreshing(true);

        const listResp = await getNotifications({ limit: 10 });

        if (!listResp?.error) {
            setNotifications(listResp?.data?.notifications ?? []);
            setUnreadCount(listResp?.data?.unread_count ?? 0);
        }
        setIsRefreshing(false);
    }, [isLoggedIn]);

    useEffect(() => {
        if (!isLoggedIn) {
            setNotifications([]);
            setUnreadCount(0);
            return;
        }

        loadNotifications();
        const intervalId = setInterval(loadNotifications, 120000);

        return () => clearInterval(intervalId);
    }, [isLoggedIn, loadNotifications]);

    return (
        <div className="relative flex items-center gap-x-3" ref={dropdownRef}>
            {isLoggedIn && (
                <div className="relative">
                    <button
                        type="button"
                        className="relative flex items-center justify-center h-10 w-10 rounded-full bg-zinc-100/10 hover:bg-zinc-100/20"
                        onClick={() => {
                            setNotificationOpen(prev => !prev);
                            setToggle(false);
                        }}
                    >
                        <NotificationsNoneOutlinedIcon className="text-slate-50" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                                {unreadCount > 99 ? "99+" : unreadCount}
                            </span>
                        )}
                    </button>

                    {notificationOpen && (
                        <div className="absolute right-0 mt-2 w-80 bg-zinc-50 dark:bg-neutral-800 dark:text-slate-200 rounded-2xl shadow-lg py-2 z-50 overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-200/60 dark:border-neutral-700">
                                <div className="flex items-center gap-1">
                                    <p className="text-sm font-semibold">Notifications</p>
                                    <button
                                        type="button"
                                        className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-neutral-700 disabled:opacity-60"
                                        title="Refresh"
                                        onClick={loadNotifications}
                                        disabled={isRefreshing}
                                    >
                                        <RefreshOutlinedIcon
                                            className={`text-slate-500 ${isRefreshing ? "animate-spin" : ""}`}
                                            style={{ width: "16px", height: "16px" }}
                                        />
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    className="text-xs text-red-600 hover:underline"
                                    onClick={async () => {
                                        await markAllNotificationsRead();
                                        setNotifications(prev => prev.map(item => ({ ...item, is_read: true })));
                                        setUnreadCount(0);
                                    }}
                                >
                                    Mark all as read
                                </button>
                            </div>
                            <div className="max-h-80 overflow-auto">
                                {notifications.length === 0 && (
                                    <p className="px-4 py-6 text-sm text-center text-slate-500">No notifications</p>
                                )}
                                {notifications.map((notification) => (
                                    <button
                                        key={notification.id}
                                        type="button"
                                        className={`w-full text-left px-4 py-3 border-b border-zinc-100 dark:border-neutral-700 hover:bg-zinc-100 dark:hover:bg-neutral-700 ${
                                            notification.is_read ? "text-slate-500" : "text-slate-900 dark:text-white"
                                        }`}
                                        onClick={async () => {
                                            if (!notification.is_read) {
                                                await markNotificationRead(notification.id);
                                                setNotifications(prev =>
                                                    prev.map(item =>
                                                        item.id === notification.id
                                                            ? { ...item, is_read: true }
                                                            : item
                                                    )
                                                );
                                                setUnreadCount(prev => Math.max(prev - 1, 0));
                                            }
                                        }}
                                    >
                                        <p className="text-xs">{notification.message}</p>
                                        <p className="text-[11px] text-slate-400 mt-1">
                                            {`${new Date(notification.created_at).toLocaleDateString()} ${new Date(notification.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {isLoggedIn && (
                <div
                    className={`flex items-center py-2 px-3 bg-zinc-100/10 ${toggle ? "rounded-t-3xl" : "rounded-3xl"} cursor-pointer focus:outline-none`}
                    onClick={() => {
                        setToggle(prev => !prev);
                        setNotificationOpen(false);
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
            )}

            {toggle && (
                <div className="absolute right-0 top-12 w-72 bg-zinc-50 dark:bg-neutral-800 dark:text-slate-200 rounded-2xl shadow-lg py-2 z-50 overflow-hidden">
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
