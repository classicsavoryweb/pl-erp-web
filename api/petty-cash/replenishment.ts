import { axiosHelper } from "../axios-config";

export const getAllReplenishments = async (payload?: {}) => {
    return await axiosHelper({ func_path: '/get-all-replenishments', method: 'GET', payload });
};

export const exportAllReplenishments = async (payload?: {}) => {
    return await axiosHelper({
        func_path: '/export-all-replenishments',
        method: 'GET',
        payload,
        responseType: 'blob',
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
    });
};

export const getPendingCashIssuancesForReplenishment = async () => {
    return await axiosHelper({ func_path: '/get-pending-cash-issuances-for-replenishment', method: 'GET' });
};

export const getReplenishment = async (id: number) => {
    return await axiosHelper({ func_path: `/get-replenishment/${id}`, method: 'GET' });
};

export const createReplenishment = async () => {
    return await axiosHelper({ func_path: '/create-replenishment', method: 'POST' });
};

export const checkExistingReplenishment = async () => {
    return await axiosHelper({ func_path: '/check-existing-replenishment', method: 'GET' });
};

export const postReplenishment = async (id: number) => {
    return await axiosHelper({ func_path: `/post-replenishment/${id}`, method: 'POST' });
};

export const voidReplenishment = async (id: number, payload: {}) => {
    return await axiosHelper({ func_path: `/void-replenishment/${id}`, method: 'POST', payload });
};
