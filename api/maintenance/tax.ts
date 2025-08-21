import { axiosHelper } from "../axios-config";

export const getAllTax = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-tax',
        method: 'GET',
        payload: payload
    })

    return resData;
};

export const exportAllTax = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-tax',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    });

    return resData;
};

export const getTax = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-tax',
        method: 'GET',
        payload: payload
    });

    return resData;
}

export const createTax = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-tax',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editTax = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-tax/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};