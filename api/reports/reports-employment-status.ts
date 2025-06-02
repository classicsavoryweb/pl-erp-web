import { axiosHelper } from "../axios-config";

export const getEmploymentStatusReport = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-employment-status-report',
        method: 'GET',
        payload: payload
    });

    return resData;
};