import { axiosHelper } from "./axios-config";

export const getAllPositions = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-positions',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const getPositions = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-positions',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const createPosition = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-position',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editPosition = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-position/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};
