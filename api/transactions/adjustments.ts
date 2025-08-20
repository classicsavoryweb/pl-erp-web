import { axiosHelper } from "../axios-config";

export const getAllAdjustments = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-adjustments',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const getAdjustment = async (id: string) => {
    const resData = await axiosHelper({
        func_path: `/get-adjustment/${id}`,
        method: 'GET',
    });

    return resData;
};

export const approveAdjustments = async (id: string) => {
    const resData = await axiosHelper({
        func_path: `/approve-adjustments/${id}`,
        method: 'GET',
    });

    return resData;
};

export const voidAdjustments = async (id: string) => {
    const resData = await axiosHelper({
        func_path: `/void-adjustments/${id}`,
        method: 'GET',
    });

    return resData;
};

export const unapproveAdjustments = async (id: string) => {
    const resData = await axiosHelper({
        func_path: `/unapprove-adjustments/${id}`,
        method: 'GET',
    });

    return resData;
};

export const editAdjustments = async (payload: {}, id: string) => {
    const resData = await axiosHelper({
        func_path: `/edit-adjustments/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const createAdjustments = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: "/create-adjustments",
        method: 'POST',
        payload: payload
    });

    return resData;
};