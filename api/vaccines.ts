import { axiosHelper } from "./axios-config";

export const getAllVaccines = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-vaccines',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const exportAllVaccines = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-vaccines',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }
    });

    return resData;
};

export const getVaccines = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-vaccines',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const createVaccine = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-vaccine',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editVaccine = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-vaccine/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};
