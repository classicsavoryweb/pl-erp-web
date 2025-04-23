import { axiosHelper } from "./axios-config";

export const login = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/login',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const logout = async () => {
    const resData = await axiosHelper({
        func_path: '/logout',
        method: 'GET',
    });

    return resData;
};

export const changePassword = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/change-password',
        method: 'POST',
        payload: payload
    });

    return resData;
};