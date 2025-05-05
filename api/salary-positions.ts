import { axiosHelper } from "./axios-config";

export const getAllSalaryPositions = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-salary-positions',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const getSalaryPositions = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-salary-positions',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const createSalaryPosition = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-salary-position',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editSalaryPosition = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-salary-position/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};
