import { axiosHelper } from "../axios-config";

export const exportBankAccountHistory = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-bank-account-history',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }
    });

    return resData;
};