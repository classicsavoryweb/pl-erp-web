import { axiosHelper } from "../axios-config";

export const getAllPayrollList = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-payroll-list',
        method: 'GET',
        payload: payload
    });

    return resData;
};
