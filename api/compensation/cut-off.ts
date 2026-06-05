import { axiosHelper } from "../axios-config";

export const getAllCutOffs = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-cut-off',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const getAllFinalizedCutOffs = async () => {
    const resData = await axiosHelper({
        func_path: '/get-all-finalized-cut-offs',
        method: 'GET',
    });

    return resData;
};

export const getActiveCutOff = async () => {
    const resData = await axiosHelper({
        func_path: '/get-active-cut-off',
        method: 'GET',
    });

    return resData;
};

export const createCutOff = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-cut-off',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editCutOff = async (payload: {}, id: number | string) => {
    const resData = await axiosHelper({
        func_path: `/edit-cut-off/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const finalizeCutOff = async (id: number | string) => {
    const resData = await axiosHelper({
        func_path: `/finalize-cut-off/${id}`,
        method: 'GET',
    });

    return resData;
};

export const initializePayroll = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/initialize-payroll',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const generatePayroll = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/generate-payroll',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const reComputeIncentives = async (id: number | string) => {
    const resData = await axiosHelper({
        func_path: `/recompute-incentives/${id}`,
        method: 'GET',
    });

    return resData;
};
