import { axiosHelper } from "../axios-config";

export const getAllReportsPhilhealthContributions = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-reports-philhealth-contributions',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const exportAllReportsPhilhealthContributions = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-reports-philhealth-contributions',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }
    });

    return resData;
};