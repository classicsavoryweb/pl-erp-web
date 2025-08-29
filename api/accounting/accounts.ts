import { axiosHelper } from "../axios-config";

export const getAccounts = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-accounts',
        method: 'GET',
        payload: payload
    });

    return resData;
};