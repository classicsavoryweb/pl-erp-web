import { axiosHelper } from "../axios-config";

export const getAllPhilhealth = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-philhealth',
        method: 'GET',
        payload: payload
    })

    return resData;
};

export const exportAllPhilhealth = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-philhealth',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    });

    return resData;
};

export const getPhilhealth = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-philhealth',
        method: 'GET',
        payload: payload
    });

    return resData;
}

export const createPhilhealth = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-philhealth',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editPhilhealth = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-philhealth/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};