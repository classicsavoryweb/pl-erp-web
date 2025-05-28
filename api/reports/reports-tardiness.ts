import { axiosHelper } from "../axios-config";

export const getAllReportsTardiness = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-reports-tardiness',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const voidTardiness = async ( id: number, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/void-reports-tardiness/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const approveTardiness = async ( id: number) => {
    const resData = await axiosHelper({
        func_path: `/approve-reports-tardiness/${id}`,
        method: 'GET',
    });

    return resData;
};

export const getTardinessDetails = async ( id: number) => {
    const resData = await axiosHelper({
        func_path: `/get-tardiness-details/${id}`,
        method: 'GET',
    });

    return resData;
};

export const importTardinessOffenses = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/import-reports-tardiness`,
        method: 'POST',
        payload: payload,
        additionalHeaders: {
            "Content-Type": "multipart/form-data"
        }
    });

    return resData;
};

export const approveBulkTardiness = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: "/approve-reports-all-tardiness",
        method: 'POST',
        payload: payload,
    });

    return resData;
};

export const editMinutesOfTardiness = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: "/edit-reports-minutes-tardiness",
        method: 'POST',
        payload: payload,
    });

    return resData;
};

export const sendTardinessNTE = async ( id: number, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/send-report-tardiness-nte/${id}`,
        method: 'POST',
        payload: payload,
        additionalHeaders: {
            "Content-Type": "multipart/form-data"
        }
    });

    return resData;
};

export const getNTEDetaills = async ( id: number) => {
    const resData = await axiosHelper({
        func_path: `/get-reports-nte-details/${id}`,
        method: 'GET',
    });

    return resData;
};