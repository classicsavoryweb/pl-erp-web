import { axiosHelper } from "../axios-config";

export const generateTimeKeeping = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: "/generate-time-keeping",
        method: 'POST',
        payload: payload
    })

    return resData;
};

export const getAllTimeKeeping = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: "/get-all-time-keeping",
        method: 'GET',
        payload: payload
    })

    return resData;
};

export const triggerFetchBiotime = async () => {
    const resData = await axiosHelper({
        func_path: "/trigger-fetch-biotime",
        method: 'GET',
    })

    return resData;
};

export const exportAllTimeKeeping = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: "/export-all-time-keeping",
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }
    })

    return resData;
};

export const getTimeKeeping = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: "/get-time-keeping",
        method: 'GET',
        payload: payload
    })

    return resData;
};

export const updateTimeKeepingUndertime = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: "/update-time-keeping-undertime",
        method: "POST",
        payload: payload
    });

    return resData;
};

export const generateTimeKeepingSummary = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: "/generate-time-keeping-summary",
        method: 'POST',
        payload: payload
    })

    return resData;
};

export const getAllTimeKeepingSummary = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: "/get-all-time-keeping-summary",
        method: 'GET',
        payload: payload
    })

    return resData;
};

export const exportAllTimeKeepingSummary = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: "/export-all-time-keeping-summary",
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }
    })

    return resData;
};
