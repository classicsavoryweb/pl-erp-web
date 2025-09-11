import { axiosHelper } from "../axios-config";

export const getAllTerms = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-terms',
        method: 'GET',
        payload: payload
    })

    return resData;
};

export const exportAllTerms = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-terms',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    });

    return resData;
};

export const getTerm = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-term',
        method: 'GET',
        payload: payload
    });

    return resData;
}

export const createTerm = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-term',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editTerm = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-term/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};