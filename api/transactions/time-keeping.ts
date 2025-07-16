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