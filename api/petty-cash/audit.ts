import { axiosHelper } from "../axios-config";

export const getAllReplenishmentsForAudit = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-replenishments-audit',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const reviewReplenishmentAudit = async (id: number) => {
    return await axiosHelper({ func_path: `/review-replenishment-audit/${id}`, method: 'POST' });
};

export const postReplenishmentAudit = async (id: number) => {
    return await axiosHelper({ func_path: `/post-replenishment-audit/${id}`, method: 'POST' });
};
