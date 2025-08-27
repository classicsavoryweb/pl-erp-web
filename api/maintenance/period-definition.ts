import { axiosHelper } from "../axios-config";

export const getAllPeriodDefinition = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-period-definition',
        method: 'GET',
        payload: payload
    })

    return resData;
};

export const exportAllPeriodDefinition = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-period-definition',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    });

    return resData;
};

export const getPeriodDefinition = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-period-definition',
        method: 'GET',
        payload: payload
    });

    return resData;
}

export const createPeriodDefinition = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-period-definition',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editPeriodDefinition = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-period-definition/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};