import { axiosHelper } from "./axios-config";

export const getAllCoeReasons = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-coe-reasons',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const getCoeReasons = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-coe-reasons',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const createCoeReason = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-coe-reason',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editCoeReason = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-coe-reason/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};