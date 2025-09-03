import { axiosHelper } from "../axios-config";

export const getAllIncentivesManagement = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-incentives-management',
        method: 'GET',
        payload: payload
    })

    return resData;
};

export const exportAllIncentivesManagement = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-incentives-management',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    });

    return resData;
};

export const getIncentivesManagement = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-incentives-management',
        method: 'GET',
        payload: payload
    });

    return resData;
}

export const createIncentivesManagement = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-incentives-management',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editIncentivesManagement = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-incentives-management/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};