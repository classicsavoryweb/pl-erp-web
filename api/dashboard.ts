import { axiosHelper } from "./axios-config";

export const getAllSummaryDetails = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-summary-details',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const getEmployeeBirthMonth = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-employees-birthmonth',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const getEmployeeExpiringContracts = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-employees-expiring-contracts',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const getUniformSummaryDetails = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-uniform-summary-details',
        method: 'GET',
        payload:payload
    });

    return resData;
}

export const getEmployeeAnniversary = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-employees-anniversary',
        method:'GET',
        payload:payload
    })

    return resData;
}

export const getItemCriticalLevel = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-nearly-out-of-stocks',
        method:'GET',
        payload:payload
    })

    return resData;
}