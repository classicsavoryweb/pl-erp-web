import { axiosHelper } from "../axios-config";

export const getAllCSHubTransactionType = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-cshub-transaction-types',
        method: 'GET',
        payload: payload
    })

    return resData;
};

export const getCSHubTransactionType = async () => {
    const resData = await axiosHelper({
        func_path: '/get-cshub-transaction-types',
        method: 'GET',
    })

    return resData;
};

export const exportAllCSHubTransactionType = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-cshub-transaction-types',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    });

    return resData;
};