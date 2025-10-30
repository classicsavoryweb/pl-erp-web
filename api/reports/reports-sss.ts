import { axiosHelper } from "../axios-config";

export const getAllReportsSSSContributions = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-reports-sss-contributions',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const getAllReportsSSSLoans = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-reports-sss-loans',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const getReportsSSSLoanTypes = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-reports-sss-loan-types',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const exportAllReportsSSSContributions = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-reports-sss-contributions',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }
    });

    return resData;
};

export const exportAllReportsSSSLoans = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-reports-sss-loans',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }
    });

    return resData;
};