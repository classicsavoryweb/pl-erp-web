import { axiosHelper } from "../axios-config";

export const getAllAdditionalIncome = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-additional-income',
        method: 'GET',
        payload: payload
    })

    return resData;
};

export const exportAllAdditionalIncome = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-additional-income',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    });

    return resData;
};

export const getAdditionalIncome = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-additional-income',
        method: 'GET',
        payload: payload
    });

    return resData;
}

export const createAdditionalIncome = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-additional-income',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editAdditionalIncome = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-additional-income/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};