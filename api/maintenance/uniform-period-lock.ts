import { axiosHelper } from "../axios-config";

export const getUniformPeriodLocks = (payload?: {}) => axiosHelper({
    func_path: "/get-uniform-period-locks",
    method: "GET",
    payload,
});

export const saveUniformPeriodLockPeriod = (payload: {}) => axiosHelper({
    func_path: "/save-uniform-period-lock-period",
    method: "POST",
    payload,
});
