import { axiosHelper } from "../axios-config";

export const getTransType = async () => {
    const resData = await axiosHelper({
        func_path: '/get-trans-type',
        method: 'GET',
    })

    return resData;
};

export const getExamType = async () => {
    const resData = await axiosHelper({
        func_path: '/get-exam-type',
        method: 'GET',
    })

    return resData;
};