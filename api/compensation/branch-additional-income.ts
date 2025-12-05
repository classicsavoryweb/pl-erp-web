import { axiosHelper } from "../axios-config";

export const getAllBranchAdditionalIncome = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-branch-additional-income',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const saveBranchAdditionalIncome = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/save-branch-additional-income',
        method: 'POST',
        payload: payload
    });

    return resData;
};