import { axiosHelper } from "../axios-config";

export const getAllPettyCashCustodians = async (payload?: {}) => {
    return await axiosHelper({ func_path: '/get-all-petty-cash-custodians', method: 'GET', payload });
};

export const exportAllPettyCashCustodians = async (payload?: {}) => {
    return await axiosHelper({
        func_path: '/export-all-petty-cash-custodians',
        method: 'GET',
        payload,
        responseType: "blob",
        additionalHeaders: { Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
    });
};

export const createPettyCashCustodian = async (payload: {}) => {
    return await axiosHelper({ func_path: '/create-petty-cash-custodian', method: 'POST', payload });
};

export const editPettyCashCustodian = async (payload: {}, id: number) => {
    return await axiosHelper({ func_path: `/edit-petty-cash-custodian/${id}`, method: 'POST', payload });
};
