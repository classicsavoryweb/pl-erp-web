import { axiosHelper } from "../axios-config";

export const getAllReportsVaccination = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-reports-vaccination',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const exportAllReportsVaccination = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-reports-vaccination',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }
    });

    return resData;
};
