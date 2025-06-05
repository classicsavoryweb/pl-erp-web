import { axiosHelper } from "./axios-config";

export const getAllAgencies = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-agencies',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const exportAllAgencies = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-agencies',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }
    });

    return resData;
};

export const getAgencies = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-agencies',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const createAgency = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-agency',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editAgency = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-agency/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};
