import { axiosHelper } from "../axios-config";

export const getAllPayroll = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-payroll',
        method: 'GET',
        payload: payload
    });

    return resData;
};

// export const createCutOff = async (payload: {}) => {
//     const resData = await axiosHelper({
//         func_path: '/create-cut-off',
//         method: 'POST',
//         payload: payload
//     });

//     return resData;
// };

// export const editCutOff = async (payload: {}, id: number | string) => {
//     const resData = await axiosHelper({
//         func_path: `/edit-cut-off/${id}`,
//         method: 'POST',
//         payload: payload
//     });

//     return resData;
// };

// export const initializeCutOff = async (id: number | string) => {
//     const resData = await axiosHelper({
//         func_path: `/initialize-cut-off/${id}`,
//         method: 'GET',
//     });

//     return resData;
// };