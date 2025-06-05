import { axiosHelper } from "./axios-config";

export const getAllTrainingTitles = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-training-titles',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const exportAllTrainingTitles = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-training-titles',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }
    });

    return resData;
};

export const getTrainingTitles = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-training-titles',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const createTrainingTitle = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-training-title',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editTrainingTitle = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-training-title/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};
