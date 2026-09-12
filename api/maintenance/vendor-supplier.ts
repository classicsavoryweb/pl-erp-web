import { axiosHelper } from "../axios-config";

export const getUniformSupplier = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-uniform-supplier',
        method: 'GET',
        payload: payload
    })

    return resData;
};

export const createUniformSupplier = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-uniform-supplier',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const exportUniformSupplier = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-uniform-supplier',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }
    })

    return resData;
};




