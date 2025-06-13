import { axiosHelper } from "./axios-config";

export const getAllActingCapacityReasons = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-acting-capacity-reasons',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const exportAllActingCapacityReasons = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-acting-capacity-reasons',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }
    });

    return resData;
};

export const getActingCapacityReasons = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-acting-capacity-reasons',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const createActingCapacityReason = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-acting-capacity-reason',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editActingCapacityReason = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-acting-capacity-reason/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};