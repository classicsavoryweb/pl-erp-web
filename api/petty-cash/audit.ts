import { axiosHelper } from "../axios-config";

export const getAllReplenishmentsForAudit = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-replenishments-audit',
        method: 'GET',
        payload: payload
    });

    return resData;
};
