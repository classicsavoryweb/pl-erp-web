import { axiosHelper } from "../axios-config";

export const getAllConverterDetails = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-converter-details',
        method: 'GET',
        payload: payload
    });

    return resData;

};

export const getAllConverterMain = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-converter-main',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const voidConverterDetails = async (id: number) => {
    const resData = await axiosHelper({
        func_path: `/void-converter-details/${id}`,
        method: 'GET',
    });

    return resData;
};

export const createConverterDetails = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-converter-details',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editConverterDetails = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-converter-details/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const createConverterMain = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-converter-main',
        method: 'POST',
        payload: payload
    });

    return resData;
};