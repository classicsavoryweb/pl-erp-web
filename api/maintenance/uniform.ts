import { axiosHelper } from "../axios-config";

export const getUniform = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-uniform',
        method: 'GET',
        payload: payload
    })

    return resData;
};

export const createUniform = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-uniform',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editUniform = async (payload: {},id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-uniform/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const deleteUniform = async (payload: {},id: number) => {
    const resData = await axiosHelper({
        func_path: `/delete-uniform/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};


