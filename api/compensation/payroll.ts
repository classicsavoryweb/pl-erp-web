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

export const updatePayrollDeduction = async (id: number, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/update-payroll-deduction/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const updatePayrollDetails = async (id: number, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/update-payroll-details/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const updatePayrollIncentive = async (id: number, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/update-payroll-incentive/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};
