import { axiosHelper } from "../axios-config";

export const getAllCutOffs = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-cut-off',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const createCutOff = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-cut-off',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editCutOffs = async (payload: {}, id: number | string) => {
    const resData = await axiosHelper({
        func_path: `/edit-cut-off/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};