import { axiosHelper } from "../axios-config";

export const getAllReportsTardiness = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-reports-tardiness',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const voidTardiness = async ( id: number) => {
    const resData = await axiosHelper({
        func_path: `/void-reports-tardiness/${id}`,
        method: 'GET',
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