import { axiosHelper } from "../axios-config";

export const getAllPettyCashApprovers = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-petty-cash-approvers',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const exportAllPettyCashApprovers = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-petty-cash-approvers',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    });

    return resData;
};

export const createPettyCashApprover = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-petty-cash-approver',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editPettyCashApprover = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-petty-cash-approver/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};
