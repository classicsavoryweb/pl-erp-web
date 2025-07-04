import { axiosHelper } from "./axios-config";

export const getAllHolidays = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-holidays',
        method: 'GET',
        payload: payload
    })

    return resData;
};

export const exportAllHolidays = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-holidays',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    });

    return resData;
};

export const getHolidays = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-holiday',
        method: 'GET',
        payload: payload
    });

    return resData;
}

export const createHoliday = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-holiday',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editHoliday = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-holiday/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};