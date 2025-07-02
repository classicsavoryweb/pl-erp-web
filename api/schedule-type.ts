import { axiosHelper } from "./axios-config";

export const getAllScheduleType = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-schedule-type',
        method: 'GET',
        payload: payload
    })

    return resData;
};

export const getScheduleType = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-schedule-type',
        method: 'GET',
        payload: payload
    });

    return resData;
}

export const createScheduleType = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/add-schedule-type',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editScheduleType = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-schedule-type/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};