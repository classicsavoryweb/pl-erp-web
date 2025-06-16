import { axiosHelper } from "../axios-config";

export const getAllReportsOffenses = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-reports-offenses',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const exportAllReportsOffenses = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-reports-offenses',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }
    });

    return resData;
};