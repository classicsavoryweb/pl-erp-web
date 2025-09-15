import { axiosHelper } from "../axios-config";

export const getAllLastPaySetup = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-last-pay-setup',
        method: 'GET',
        payload: payload
    })

    return resData;
};

export const exportAllLastPaySetup = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-last-pay-setup',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    });

    return resData;
};

export const getLastPaySetup = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-last-pay-setup',
        method: 'GET',
        payload: payload
    });

    return resData;
}

export const createLastPaySetup = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-last-pay-setup',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editLastPaySetup = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-last-pay-setup/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};