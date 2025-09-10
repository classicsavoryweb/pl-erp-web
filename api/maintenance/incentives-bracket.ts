import { axiosHelper } from "../axios-config";

export const getAllIncentivesBracket = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-incentives-bracket',
        method: 'GET',
        payload: payload
    })

    return resData;
};

export const exportAllIncentivesBracket = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-incentives-bracket',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    });

    return resData;
};

export const getIncentivesBracket = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-incentives-bracket',
        method: 'GET',
        payload: payload
    });

    return resData;
}

export const createIncentivesBracket = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-incentives-bracket',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editIncentivesBracket = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-incentives-bracket/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};