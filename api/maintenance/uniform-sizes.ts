import { axiosHelper } from "../axios-config";

export const getUniformSizes = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-uniform-sizes',
        method: 'GET',
        payload: payload
    })

    return resData;
};

export const createUniformSizes = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-uniform-sizes',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editUniformSizes = async (payload: {},id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-uniform-sizes/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};



