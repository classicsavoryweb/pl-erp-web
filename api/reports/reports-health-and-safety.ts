import { axiosHelper } from "../axios-config";

export const getAllReportsHealthAndSafety = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-reports-health-and-safety',
        method: 'GET',
        payload: payload
    });

    return resData;
};