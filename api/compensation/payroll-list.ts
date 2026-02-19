import { axiosHelper } from "../axios-config";

export const getAllPayrollList = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-payroll-list',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const getBankDetails = async (id: string, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/get-bank-details/${id}`,
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const exportAllPayrollList = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-payroll-list',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }
    });

    return resData;
};


export const exportPayrollBankDetails = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/payroll/export-bank-details',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }
    });

    return resData;
};


export const createPayrollList = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-payroll-list',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editPayrollList = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-payroll-list/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};