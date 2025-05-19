import { axiosHelper } from "../axios-config";

export const getAllReportsOffenses = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-reports-offenses',
        method: 'GET',
        payload: payload
    });

    return resData;
};