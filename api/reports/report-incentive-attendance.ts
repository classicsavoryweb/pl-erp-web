import { axiosHelper } from "../axios-config";

export const exportIncentiveAttendance = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-incentive-attendance',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }
    });

    return resData;
};
