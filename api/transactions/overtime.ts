import { axiosHelper } from "../axios-config";

export const getAllOvertime = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-overtime',
        method: 'GET',
        payload: payload
    })

    return resData;
};

export const exportAllOvertime = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-overtime',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    });

    return resData;
};

export const payBulkOvertime = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: "/pay-all-overtime",
        method: 'POST',
        payload: payload,
    });

    return resData;
};

export const getOvertime = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-overtime',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const payOvertime = async ( id: number) => {
    const resData = await axiosHelper({
        func_path: `/pay-overtime/${id}`,
        method: 'GET',
    });

    return resData;
};

export const unpayOvertime = async ( id: number) => {
    const resData = await axiosHelper({
        func_path: `/unpay-overtime/${id}`,
        method: 'GET',
    });

    return resData;
};

export const createOvertime = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-overtime',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editOvertime = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-overtime/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const importOvertime = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/import-overtime`,
        method: 'POST',
        payload: payload,
        additionalHeaders: {
            "Content-Type": "multipart/form-data"
        }
    });

    return resData;
};