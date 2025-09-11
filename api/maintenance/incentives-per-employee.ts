import { axiosHelper } from "../axios-config";

export const getAllIncentivesPerEmployee = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-incentives-per-employee',
        method: 'GET',
        payload: payload
    })

    return resData;
};

export const exportAllIncentivesPerEmployee = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-incentives-per-employee',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    });

    return resData;
};

export const getIncentivesPerEmployee = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-incentives-per-employee',
        method: 'GET',
        payload: payload
    });

    return resData;
}

export const createIncentivesPerEmployee = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-incentives-per-employee',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editIncentivesPerEmployee = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-incentives-per-employee/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};