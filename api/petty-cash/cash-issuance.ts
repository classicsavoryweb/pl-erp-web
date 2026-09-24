import { axiosHelper } from "../axios-config";

export const getAllCashIssuances = async (payload?: {}) => {
    return await axiosHelper({ func_path: '/get-all-cash-issuances', method: 'GET', payload });
};

export const exportAllCashIssuances = async (payload?: {}) => {
    return await axiosHelper({
        func_path: '/export-all-cash-issuances',
        method: 'GET',
        payload,
        responseType: 'blob',
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
    });
};

export const getPCVNumber = async (payload: { branch_id: number | string }) => {
    return await axiosHelper({ func_path: '/get-pcv-number', method: 'GET', payload });
};

export const getBranchEmployees = async (payload: { branch_id: number | string }) => {
    return await axiosHelper({ func_path: '/get-petty-cash-branch-employees', method: 'GET', payload });
};

export const getMyEmployees = async () => {
    return await axiosHelper({ func_path: '/get-my-employees', method: 'GET' });
};

export const getApproverEmployees = async () => {
    return await axiosHelper({ func_path: '/get-approver-employees', method: 'GET' });
};

export const getBranchApprovers = async (payload: { branch_id: number | string; amount: number | string }) => {
    return await axiosHelper({ func_path: '/get-branch-approvers', method: 'GET', payload });
};

export const getCashIssuance = async (id: number) => {
    return await axiosHelper({ func_path: `/get-cash-issuance/${id}`, method: 'GET' });
};

export const createCashIssuance = async (payload: {}) => {
    return await axiosHelper({ func_path: '/create-cash-issuance', method: 'POST', payload });
};

export const voidCashIssuance = async (id: number, payload: {}) => {
    return await axiosHelper({ func_path: `/void-cash-issuance/${id}`, method: 'POST', payload });
};

export const getCSHubImportCandidates = async (payload?: {}) => {
    return await axiosHelper({ func_path: '/get-cshub-import-candidates', method: 'GET', payload });
};

export const importCSHubPettyCash = async (payload: {}) => {
    return await axiosHelper({ func_path: '/import-cshub-petty-cash', method: 'POST', payload });
};
