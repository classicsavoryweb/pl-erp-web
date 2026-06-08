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





