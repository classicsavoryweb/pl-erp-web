import { axiosHelper } from "../axios-config";

export const getUniformPeriodLocks = (payload?: {}) => axiosHelper({
    func_path: "/get-uniform-period-locks",
    method: "GET",
    payload,
});

export const createUniformPeriodLock = (payload: {}) => axiosHelper({
    func_path: "/create-uniform-period-lock",
    method: "POST",
    payload,
});

export const editUniformPeriodLock = (id: number, payload: {}) => axiosHelper({
    func_path: `/edit-uniform-period-lock/${id}`,
    method: "POST",
    payload,
});
