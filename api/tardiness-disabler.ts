import { axiosHelper } from "./axios-config";

export const getAllTardinessDisablers = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: "/get-all-tardiness-disablers",
        method: "GET",
        payload,
    });

    return resData;
};

export const upsertTardinessDisabler = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: "/upsert-tardiness-disabler",
        method: "POST",
        payload,
    });

    return resData;
};
