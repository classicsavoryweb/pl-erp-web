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

export const editPayrollDeductionDetails = async (id: number, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/edit-payroll-deduction-details/${id}`,
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



export const previewPayrollComputation = async (id: number, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/preview-payroll-compution/${id}`,
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

export const updatePayrollContributions = async (id: number, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/update-payroll-contributions/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const updatePayrollTimekeepingBranch = async (id: number, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/update-payroll-timekeeping-branch/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};
