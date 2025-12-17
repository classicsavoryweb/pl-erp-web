import { axiosHelper } from "../axios-config";

export const getAllTransactionsScheduleTime = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-transactions-schedule-time',
        method: 'GET',
        payload: payload
    })

    return resData;
};

export const exportAllTransactionsScheduleTime = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-transactions-schedule-time',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    });

    return resData;
};

export const getTransactionsScheduleTime = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-transactions-schedule-time',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const validateImportTransactionsScheduleTime = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/validate-import-transactions-schedule-time',
        method: 'POST',
        payload: payload,
        additionalHeaders: payload.hasOwnProperty('schedule_time_file')
            ? { "Content-Type": "multipart/form-data" }
            : {}
    });

    return resData;
};

export const fetchTransactionScheduleTime = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/fetch-transactions-schedule-time',
        method: 'POST',
        payload: payload,
    });

    return resData;
};

export const importTransactionsScheduleTime = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/import-transactions-schedule-time',
        method: 'POST',
        payload: payload,
        additionalHeaders: payload.hasOwnProperty('schedule_time_file')
            ? { "Content-Type": "multipart/form-data" }
            : {}
    });

    return resData;
};
