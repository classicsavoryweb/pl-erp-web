import { axiosHelper } from "../axios-config";

export const getAllReportsBDOCashCard = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-reports-bdo-cash-card',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const getAllReportsBDOCashCardHistory = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-reports-bdo-cash-card-history',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const exportAllReportsBDOCashCard = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-reports-bdo-cash-card',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }
    });

    return resData;
};

export const exportAllReportsBDOCashCardHistory = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-reports-bdo-cash-card-history',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }
    });

    return resData;
};