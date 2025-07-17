import { axiosHelper } from "../axios-config";

export const getAllIncorrectLogs = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-incorrect-logs',
        method: 'GET',
        payload: payload
    })

    return resData;
};

export const exportAllIncorrectLogs = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-incorrect-logs',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    });

    return resData;
};

export const getIncorrectLogs = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-incorrect-logs',
        method: 'GET',
        payload: payload
    });

    return resData;
};