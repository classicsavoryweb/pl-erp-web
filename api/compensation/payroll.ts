import { axiosHelper } from "../axios-config";

export const getAllPayroll = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-payroll',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const getPayroll = async (id: number) => {
    const resData = await axiosHelper({
        func_path: `/get-payroll/${id}`,
        method: 'GET',
    });

    return resData;
};