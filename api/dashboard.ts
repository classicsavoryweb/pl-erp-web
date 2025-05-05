import { axiosHelper } from "./axios-config";

export const getAllSummaryDetails = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-summary-details',
        method: 'GET',
        payload: payload
    });

    return resData;
};