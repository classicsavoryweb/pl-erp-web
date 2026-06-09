import { axiosHelper } from "../axios-config";

export const getAllUniformItems = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: "/get-all-uniform-items",
        method: "GET",
        payload,
    });

    return resData;
};

export const exportAllUniformItems = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: "/export-all-uniform-items",
        method: "GET",
        payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
    });

    return resData;
};

export const getUniformItemOptions = async () => {
    const resData = await axiosHelper({
        func_path: "/get-uniform-item-options",
        method: "GET",
    });

    return resData;
};

export const createUniformItem = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: "/create-uniform-item",
        method: "POST",
        payload,
    });

    return resData;
};

export const editUniformItem = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-uniform-item/${id}`,
        method: "POST",
        payload,
    });

    return resData;
};
