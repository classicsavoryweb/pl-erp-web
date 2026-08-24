import { axiosHelper } from "./axios-config";

export const getAllSummaryDetails = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-summary-details',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const getEmployeeBirthMonth = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-employees-birthmonth',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const getEmployeeExpiringContracts = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-employees-expiring-contracts',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const getPayrollSummaryDetails = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-payroll-summary-details',
        method: 'GET',
        payload: payload
    });

    return resData;
};