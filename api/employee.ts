import { axiosHelper } from "./axios-config";

export const getAllEmployees = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-employees',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const getEmployee = async (employeeNumber: string) => {
    const resData = await axiosHelper({
        func_path: `/get-employee/${employeeNumber}`,
        method: 'GET',
    });

    return resData;
};

export const getEmployees = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-employees',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const addEmployee = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/add-employee',
        method: 'POST',
        payload: payload
    });

    return resData;
};