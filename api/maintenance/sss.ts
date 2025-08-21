import { axiosHelper } from "../axios-config";

export const getAllSSS = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-sss',
        method: 'GET',
        payload: payload
    })

    return resData;
};

export const exportAllSSS = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-sss',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    });

    return resData;
};

export const getSSS = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-sss',
        method: 'GET',
        payload: payload
    });

    return resData;
}

export const createSSS = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-sss',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editSSS = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-sss/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};