import { axiosHelper } from "../axios-config";

export const getAllATDAccessTypes = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: "/get-all-atd-access-types",
        method: "GET",
        payload: payload,
    });

    return resData;
};

export const exportAllATDAccessTypes = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: "/export-all-atd-access-types",
        method: "GET",
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
    });

    return resData;
};

export const createATDAccessType = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: "/create-atd-access-type",
        method: "POST",
        payload: payload,
    });

    return resData;
};

export const editATDAccessType = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-atd-access-type/${id}`,
        method: "POST",
        payload: payload,
    });

    return resData;
};
