import { axiosHelper } from "./axios-config";

export const getNotifications = async (payload?: {
    limit?: number;
    unread_only?: boolean;
}) => {
    const resData = await axiosHelper({
        func_path: "/notifications",
        method: "GET",
        payload: payload ?? {}
    });

    return resData;
};

export const getUnreadNotificationCount = async () => {
    const resData = await axiosHelper({
        func_path: "/notifications/unread-count",
        method: "GET"
    });

    return resData;
};

export const markNotificationRead = async (id: number) => {
    const resData = await axiosHelper({
        func_path: "/notifications/mark-read",
        method: "POST",
        payload: { id }
    });

    return resData;
};

export const markAllNotificationsRead = async () => {
    const resData = await axiosHelper({
        func_path: "/notifications/mark-all-read",
        method: "POST"
    });

    return resData;
};
