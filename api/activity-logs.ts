import { axiosHelper } from "./axios-config";

export const getAllActivityLogs = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-activity-logs',
        method: 'GET',
        payload: payload
    });

    return resData;
};