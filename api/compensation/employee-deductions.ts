import { axiosHelper } from "../axios-config";

export const getAllEmployeeDeductions = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-employee-deductions',
        method: 'GET',
        payload: payload
    })

    return resData;
};

export const getAllEmployeeATDs = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-employee-atds',
        method: 'GET',
        payload: payload
    })

    return resData;
};

export const exportAllATDs = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-atds',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    });

    return resData;
};

export const exportAllEmployeeDeductions = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-employee-deductions',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    });

    return resData;
};

export const getEmployeeDeduction = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-employee-deduction',
        method: 'GET',
        payload: payload
    });

    return resData;
}

export const createEmployeeDeduction = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-employee-deduction',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editEmployeeDeduction = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-employee-deduction/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const endLoanTransaction = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/end-loan-transaction/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const getCSHubATDS = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-cshub-atds',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const createCSHubATDs = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/create-cshub-atds`,
        method: 'POST',
        payload: payload
    });

    return resData;
};