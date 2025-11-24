import { axiosHelper } from "../axios-config";

export const getAllPayrollProofList = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-payroll-prooflist',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const generatePayrollProoflistConverter = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/generate-payroll-prooflist-converter',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }
    });

    return resData;
};

export const exportPayrollProoflistConverter = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-payroll-prooflist-converter',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }
    });

    return resData;
};
