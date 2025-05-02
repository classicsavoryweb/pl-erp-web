import { axiosHelper } from "./axios-config";

export const getAllBankAccountTypes = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-bank-account-types',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const getBankAccountTypes = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-bank-account-types',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const createBankAccountType = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-bank-account-type',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editBankAccountType = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-bank-account-type/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};
