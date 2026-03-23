import { axiosHelper } from "../axios-config";

export const exportTimeKeepingSummaryReport = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-timekeeping-summary-report',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }
    });

    return resData;
};
