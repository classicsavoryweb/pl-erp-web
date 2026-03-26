import { axiosHelper } from "./axios-config";

export const getAllBranches = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-branches',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const exportAllBranches = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-branches',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }
    });

    return resData;
};

export const getBranches = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-branches',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const getFilterBranches = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-filter-branches',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const getBranchActivities = async (id: number) => {
    const resData = await axiosHelper({
        func_path: `/get-branch-activities/${id}`,
        method: 'GET',
    });

    return resData;
};

export const createBranch = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-branch',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editBranch = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-branch/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};
