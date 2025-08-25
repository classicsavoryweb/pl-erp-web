import { axiosHelper } from "../axios-config";

export const getAllPagibig = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-pagibig',
        method: 'GET',
        payload: payload
    })

    return resData;
};

export const exportAllPagibig = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-pagibig',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    });

    return resData;
};

export const getPagibig = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-pagibig',
        method: 'GET',
        payload: payload
    });

    return resData;
}

export const editPagibig = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-pagibig/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};