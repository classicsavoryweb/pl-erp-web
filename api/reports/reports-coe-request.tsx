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