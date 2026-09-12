import { axiosHelper } from "../axios-config";

export const getAllScheduledTimeKeepingGeneration = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-scheduled-timekeeping-generation',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const createScheduledTimeKeepingGeneration = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-scheduled-timekeeping-generation',
        method: 'POST',
        payload: payload
    });

    return resData;
};