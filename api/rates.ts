import { axiosHelper } from "./axios-config";

export const getAlllRates = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-rates',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const exportAllRates = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-rates',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }
    });

    return resData;
};

export const getRates = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-rates',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const createRate = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-rate',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editRate = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-rate/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};
