import { axiosHelper } from "../axios-config";

export const exportPayrollStatutoryReport = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: "/export-payroll-statutory",
        method: "GET",
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }
    });

    return resData;
};
