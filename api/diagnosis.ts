import { axiosHelper } from "./axios-config";

export const getAllDiagnosis= async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-diagnosis',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const exportAllDiagnosis= async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-diagnosis',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }
    });

    return resData;
};

export const getDiagnosis= async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-diagnosis',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const createDiagnosis = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-diagnosis',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editDiagnosis = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-diagnosis/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};
