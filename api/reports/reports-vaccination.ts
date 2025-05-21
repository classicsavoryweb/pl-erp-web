import { axiosHelper } from "../axios-config";

export const getAllReportsVaccination = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-reports-vaccination',
        method: 'GET',
        payload: payload
    });

    return resData;
};