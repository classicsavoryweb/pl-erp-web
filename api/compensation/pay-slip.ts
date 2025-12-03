import { axiosHelper } from "../axios-config";

export const submitPayslips = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/submit-payslips',
        method: 'POST',
        payload: payload
    });

    return resData;
};
