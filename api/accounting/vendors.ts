import { axiosHelper } from "../axios-config";

export const getVendors = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-vendors',
        method: 'GET',
        payload: payload
    });

    return resData;
};