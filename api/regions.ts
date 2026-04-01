import { axiosHelper } from "./axios-config";

export const getAllRegions = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: "/get-all-regions",
        method: "GET",
        payload,
    });

    return resData;
};

export const exportAllRegions = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: "/export-all-regions",
        method: "GET",
        payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
    });

    return resData;
};

export const getRegions = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: "/get-regions",
        method: "GET",
        payload,
    });

    return resData;
};

export const createRegion = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: "/create-region",
        method: "POST",
        payload,
    });

    return resData;
};

export const editRegion = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-region/${id}`,
        method: "POST",
        payload,
    });

    return resData;
};
