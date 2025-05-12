import { axiosHelper } from "./axios-config";

export const getAllStatus = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-status',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const getStatus = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-status',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const createEmployeeStatus = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-employee-status',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editEmployeeStatus = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-employee-status/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const deleteEmployeeStatus = async (statusId: number) => {
    const resData = await axiosHelper({
        func_path: `/delete-employee-status/${statusId}`,
        method: 'GET',
    });

    return resData;
};