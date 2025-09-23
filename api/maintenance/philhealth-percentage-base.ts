import { axiosHelper } from "../axios-config";

export const getPhilhealthPercentageBase = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-philhealth-percentage-base',
        method: 'GET',
        payload: payload
    });

    return resData;
}

export const editPhilhealthPercentageBase = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-philhealth-percentage-base/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};