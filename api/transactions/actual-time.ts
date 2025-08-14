import { axiosHelper } from "../axios-config";

export const getAllTransactionsActualTime = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-transactions-actual-time',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const exportAllTransactionsActualLogs = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-transactions-actual-logs',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    });

    return resData;
};

export const editBiotimePunches = async (payload: {}, id: string) => {
    const resData = await axiosHelper({
        func_path: `/edit-biotime-punch/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const createBiotimeLog = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: "/create-biotime-punch",
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const importTransactionsActualLogs = async (payload: {}) => {    
    const resData = await axiosHelper({
        func_path: '/import-biotime-logs',
        method: 'POST',
        payload: payload,
        additionalHeaders: {
            "Content-Type": "multipart/form-data"
        }
    });

    return resData;
};