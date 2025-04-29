import { axiosHelper } from "./axios-config";

export const getAllStations = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-stations',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const getStations = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-stations',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const createStation = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-station',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editStation = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-station/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const deleteStation = async (statusId: number) => {
    const resData = await axiosHelper({
        func_path: `/delete-station/${statusId}`,
        method: 'GET',
    });

    return resData;
};