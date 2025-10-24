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