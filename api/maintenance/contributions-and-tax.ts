import { axiosHelper } from "../axios-config";

export const getAllContributionsAndTax = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-contributions-and-tax',
        method: 'GET',
        payload: payload
    })

    return resData;
};

export const exportAllContributionsAndTax = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-contributions-and-tax',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    });

    return resData;
};

export const getContributionAndTax = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-contribution-and-tax',
        method: 'GET',
        payload: payload
    });

    return resData;
}

export const editContributionAndTax = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-contribution-and-tax/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};