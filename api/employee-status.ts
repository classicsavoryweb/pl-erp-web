import { axiosHelper } from "./axios-config";

export const getAllStatus = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-status',
        method: 'GET',
        payload: payload
    });

    return resData;
};