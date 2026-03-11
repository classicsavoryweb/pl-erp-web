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

export const importBranchAdditionalIncome = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/import-branch-additional-income',
        method: 'POST',
        payload: payload,
        additionalHeaders: payload.hasOwnProperty('additional_income_file')
            ? { "Content-Type": "multipart/form-data" }
            : {}
    });

    return resData;
};

export const exportBranchAdditionalIncome = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-branch-additional-income',
        method: 'GET',
        payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }
    });

    return resData;
};
