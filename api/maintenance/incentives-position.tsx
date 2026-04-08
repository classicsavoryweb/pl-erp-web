import { axiosHelper } from "../axios-config";

export const getAllIncentivesPosition = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-incentives-position',
        method: 'GET',
        payload: payload
    })

    return resData;
};

export const exportAllIncentivesPosition = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-incentives-position',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    });

    return resData;
};

export const createIncentivesPosition = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-incentives-position',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editIncentivesPosition = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-incentives-position/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};