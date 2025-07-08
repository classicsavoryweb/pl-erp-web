import { axiosHelper } from "../axios-config";

export const getAllTransactionsActualTime = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-transactions-actual-time',
        method: 'GET',
        payload: payload
    });

    return resData;
};