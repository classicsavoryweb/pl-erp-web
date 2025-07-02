import { axiosHelper } from "./axios-config";

export const getAllScheduleMasterlist = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-schedule-masterlist',
        method: 'GET',
        payload: payload
    })

    return resData;
};

export const exportAllScheduleMasterlist = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-schedule-masterlist',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    });

    return resData;
};

export const getScheduleMasterlist = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-schedule-masterlist',
        method: 'GET',
        payload: payload
    });

    return resData;
}

export const createScheduleMasterlist = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-schedule-masterlist',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editScheduleMasterlist = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-schedule-masterlist/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};