import { axiosHelper } from "./axios-config";

export const getAllStations = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-stations',
        method: 'GET',
        payload: payload
    });

    return resData;
};