import { axiosHelper } from "./axios-config";

export const getAllSanctions = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-sanctions',
        method: 'GET',
        payload: payload
    })

    return resData;
};

export const exportAllSanctions = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-sanctions',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    });

    return resData;
};

export const getSanctions = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-sanctions',
        method: 'GET',
        payload: payload
    });

    return resData;
}

export const createSanction = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-sanction',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editSanction = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-sanction/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};