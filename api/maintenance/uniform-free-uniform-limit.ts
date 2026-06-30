import { axiosHelper } from "../axios-config";

export const getUniformFreeUniformLimits = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: "/get-uniform-free-uniform-limits",
        method: "GET",
        payload: payload,
    });

    return resData;
};

export const createUniformFreeUniformLimit = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: "/create-uniform-free-uniform-limit",
        method: "POST",
        payload: payload,
    });

    return resData;
};

export const editUniformFreeUniformLimit = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-uniform-free-uniform-limit/${id}`,
        method: "POST",
        payload: payload,
    });

    return resData;
};
