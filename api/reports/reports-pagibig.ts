import { axiosHelper } from "../axios-config";

export const getAllReportsPagibigContributions = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-reports-pagibig-contributions',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const getAllReportsPagibigLoans = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-reports-pagibig-loans',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const exportAllReportsPagibigContributions = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-reports-pagibig-contributions',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }
    });

    return resData;
};

export const exportAllReportsPagibigLoans = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-reports-pagibig-loans',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }
    });

    return resData;
};