import { axiosHelper } from "../axios-config";

export const getAllExpenseTypes = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-expense-types',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const exportAllExpenseTypes = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-expense-types',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    });

    return resData;
};

export const getExpenseTypes = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-expense-types',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const createExpenseType = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-expense-type',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editExpenseType = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-expense-type/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};
