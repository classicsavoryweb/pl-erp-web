import { axiosHelper } from "../axios-config";

export const getAllThirteenthMonth = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-thirteenth-month-pay',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const getThirteenthMonthPay = async (id: string, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/get-thirteenth-month-pay/${id}`,
        method: "GET",
        payload: payload
    });

    return resData;
};

export const getEmployeesMonthlyAllocation = async (id: string, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/get-employees-monthly-allocation/${id}`,
        method: "GET",
        payload: payload
    });

    return resData;
};

export const getBranchesMonthlyAllocation = async (id: string, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/get-branches-monthly-allocation/${id}`,
        method: "GET",
        payload: payload
    });

    return resData;
};

export const generateThirteenthMonthPay = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/generate-thirteenth-month-pay',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const generateThirteenthMonthMonthlyAllocation = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/generate-thirteenth-month-monthly-allocation',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const generateThirteenthMonthMonthlyAllocationEntries = async (id: number) => {
    const resData = await axiosHelper({
        func_path: `/generate-thirteenth-month-monthly-allocation-entries/${id}`,
        method: 'GET',
    });

    return resData;
};

export const downloadExcelFile = async (filename: string) => {
    const resData = await axiosHelper({
        func_path: `/download-excel-file/${filename}`,
        method: 'GET',
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }
    });

    return resData;
};