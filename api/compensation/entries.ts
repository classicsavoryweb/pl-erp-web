import { axiosHelper } from "../axios-config";

export const generateEntries = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: "/generate-entries",
        method: 'POST',
        payload: payload
    })

    return resData;
};

export const getAllEntries = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: "/get-all-entries",
        method: 'GET',
        payload: payload
    })

    return resData;
};

export const exportAllEntries = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: "/export-all-entries",
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }
    })

    return resData;
};