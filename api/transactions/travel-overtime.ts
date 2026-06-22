import { axiosHelper } from "../axios-config";

export const getAllTravelOvertimes = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-travel-overtimes',
        method: 'GET',
        payload: payload
    })

    return resData;
};

export const exportAllTravelOvertimes = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-travel-overtimes',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    });

    return resData;
};

export const createTravelOvertime = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: "/create-travel-overtime",
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editTravelOvertime = async (payload: {}, id: number | string) => {
    const resData = await axiosHelper({
        func_path: `/edit-travel-overtime/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const importTravelOvertime = async (payload: {}) => {    
    const resData = await axiosHelper({
        func_path: '/import-travel-overtime',
        method: 'POST',
        payload: payload,
        additionalHeaders: {
            "Content-Type": "multipart/form-data"
        }
    });

    return resData;
};