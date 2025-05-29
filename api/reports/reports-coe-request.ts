import { axiosHelper } from "../axios-config";

export const getAllReportsCoeRequests = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-reports-coe-requests',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const addReportsCoeRequest = async ( payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/add-reports-coe-request`,
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editReportsCoeRequest = async ( id: string, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/edit-reports-coe-request/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const getReportsCoeRequest = async ( id: number) => {
    const resData = await axiosHelper({
        func_path: `/get-reports-coe-request/${id}`,
        method: 'GET',
    });

    return resData;
};

export const cancelCOERequest = async ( id: number) => {
    const resData = await axiosHelper({
        func_path: `/cancel-reports-coe-request/${id}`,
        method: 'GET',
    });

    return resData;
};

export const approveCOERequest = async ( id: number) => {
    const resData = await axiosHelper({
        func_path: `/approve-reports-coe-request/${id}`,
        method: 'GET',
    });

    return resData;
};