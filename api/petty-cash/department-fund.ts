import { axiosHelper } from "../axios-config";

export const getMyCustodianInfo = async () => {
    return await axiosHelper({ func_path: '/get-my-custodian-info', method: 'GET' });
};

export const getTransactionTypes = async () => {
    return await axiosHelper({ func_path: '/get-petty-cash-transaction-types', method: 'GET' });
};

export const getPostedReplenishments = async () => {
    return await axiosHelper({ func_path: '/get-posted-replenishments', method: 'GET' });
};

export const getDepartmentFundTransactions = async (payload?: {}) => {
    return await axiosHelper({ func_path: '/get-department-fund-transactions', method: 'GET', payload });
};

export const addDepartmentFundTransaction = async (payload: {}) => {
    return await axiosHelper({ func_path: '/add-department-fund-transaction', method: 'POST', payload });
};
