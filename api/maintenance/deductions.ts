import { axiosHelper } from "../axios-config";

export const getAllDeductions = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-deductions',
        method: 'GET',
        payload: payload
    })

    return resData;
};

export const exportAllDeductions = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-deductions',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    });

    return resData;
};

export const getDeduction = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-deduction',
        method: 'GET',
        payload: payload
    });

    return resData;
}

export const createDeduction = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-deduction',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editDeduction = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-deduction/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};