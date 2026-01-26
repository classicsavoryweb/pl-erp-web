import { axiosHelper } from "../axios-config";

export const getAllOvertime = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-overtime',
        method: 'GET',
        payload: payload
    })

    return resData;
};

export const fetchOvertime = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/fetch-overtime',
        method: 'GET',
        payload: payload
    })

    return resData;
};

export const exportAllOvertime = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-overtime',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    });

    return resData;
};

export const approveBulkOvertime = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: "/approve-all-overtime",
        method: 'POST',
        payload: payload,
    });

    return resData;
};

export const getOvertime = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-overtime',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const approveOvertime = async ( id: number) => {
    const resData = await axiosHelper({
        func_path: `/approve-overtime/${id}`,
        method: 'GET',
    });

    return resData;
};

export const unapproveOvertime = async ( id: number) => {
    const resData = await axiosHelper({
        func_path: `/unapprove-overtime/${id}`,
        method: 'GET',
    });

    return resData;
};

export const voidOvertime = async ( id: number) => {
    const resData = await axiosHelper({
        func_path: `/void-overtime/${id}`,
        method: 'GET',
    });

    return resData;
};

export const forceAdjustOvertime = async (id: number) => {
    const resData = await axiosHelper({
        func_path: `/force-adjust-overtime/${id}`,
        method: 'POST',
    });

    return resData;
};

export const forceAdjustOvertimeWithoutTimeKeeping = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/force-adjust-overtime-without-timekeeping`,
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const importOvertime = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/import-overtime`,
        method: 'POST',
        payload: payload,
        additionalHeaders: {
            "Content-Type": "multipart/form-data"
        }
    });

    return resData;
};