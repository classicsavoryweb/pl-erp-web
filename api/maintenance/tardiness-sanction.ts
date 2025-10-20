import { axiosHelper } from "../axios-config";

export const getAllTardinessSanctions = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-tardiness-sanctions',
        method: 'GET',
        payload: payload
    })

    return resData;
};

export const exportAllTardinessSanctions = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-tardiness-sanctions',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    });

    return resData;
};

export const createTardinessSanction = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-tardiness-sanction',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editTardinessSanction = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-tardiness-sanction/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};