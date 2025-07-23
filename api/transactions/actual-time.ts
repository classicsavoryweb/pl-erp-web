import { axiosHelper } from "../axios-config";

export const getAllTransactionsActualTime = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-transactions-actual-time',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const editBiotimePunches = async (payload: {}, id: string) => {
    const resData = await axiosHelper({
        func_path: `/edit-biotime-punch/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
}