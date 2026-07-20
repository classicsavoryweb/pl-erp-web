import { axiosHelper } from "../axios-config";

export const getAllBir1601C = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: "/bir-1601c",
        method: "GET",
        payload: payload
    });

    return resData;
};

export const getBir1601C = async (id: string) => {
    const resData = await axiosHelper({
        func_path: `/bir-1601c/${id}`,
        method: "GET"
    });

    return resData;
};

export const generateBir1601C = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: "/bir-1601c/generate",
        method: "POST",
        payload: payload
    });

    return resData;
};

export const updateBir1601C = async (id: string, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/bir-1601c/${id}`,
        method: "POST",
        payload: payload
    });

    return resData;
};

export const finalizeBir1601C = async (id: string) => {
    const resData = await axiosHelper({
        func_path: `/bir-1601c/${id}/finalize`,
        method: "POST"
    });

    return resData;
};

export const exportBir1601CReport = async (id: string) => {
    const resData = await axiosHelper({
        func_path: `/export-bir-1601c/${id}`,
        method: "GET",
        responseType: "blob",
        additionalHeaders: {
            Accept: "application/pdf",
        }
    });

    return resData;
};
