import { axiosHelper } from "../axios-config";

export const getAllLastPays = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-last-pay',
        method: 'GET',
        payload: payload
    });

    return resData;
}

export const getAllHoldedEmployees = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-holded-employees',
        method: 'GET',
        payload: payload
    });

    return resData;
}

export const getInitialLastPay = async (employeeNumber: string) => {
    const resData = await axiosHelper({
        func_path: `/get-initial-last-pay/${employeeNumber}`,
        method: 'GET',
    });

    return resData;
}

export const createLastPayRecord = async (payload: {}, employeeNumber: string) => {
    const resData = await axiosHelper({
        func_path: `/create-last-pay/${employeeNumber}`,
        method: 'POST',
        payload: payload
    });

    return resData;
}

export const editLastPayRecord = async (payload: {}, lastPayId: string) => {
    const resData = await axiosHelper({
        func_path: `/edit-last-pay/${lastPayId}`,
        method: 'POST',
        payload: payload
    });

    return resData;
}

export const postLastPay = async (lastPayId: number) => {
    const resData = await axiosHelper({
        func_path: `/post-last-pay/${lastPayId}`,
        method: 'GET',
    });

    return resData;
}

export const removeLastPayDeduction = async (employeeNumber: string, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/remove-last-pay-deduction/${employeeNumber}`,
        method: 'POST',
        payload: payload
    });

    return resData;
}

export const editLastPayDeductionDetails = async (lastPayDeductionId: string, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/edit-last-pay-deduction-details/${lastPayDeductionId}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};
