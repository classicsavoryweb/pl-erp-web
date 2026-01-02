import { axiosHelper } from "./axios-config";

export const getAllUsers = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-users',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const exportAllUsers = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-admin-users',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }
    });

    return resData;
};

export const createUser = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-user',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editUser = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-user/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};