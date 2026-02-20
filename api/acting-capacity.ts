import { axiosHelper } from "./axios-config";

export const getAllActingCapacity = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-acting-capacity',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const exportAllActingCapacity = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-acting-capacity',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }
    });

    return resData;
};

export const addActingCapacity = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/add-acting-capacity',
        method: 'POST',
        payload: payload,
        additionalHeaders: {
            "Content-Type": "multipart/form-data"
        }
    });

    return resData;
};

export const getActingCapacity = async (id: string) => {
    const resData = await axiosHelper({
        func_path: `/get-acting-capacity/${id}`,
        method: 'GET',
    });

    return resData;
};

export const getPromotionSummary = async (employeeNumber: string,
    params?:{
        page?:number;
        per_page?:number;
    }
) => {
    return axiosHelper ({
        func_path: `/get-promotion-summary/${employeeNumber}`,
        method: "GET",
        params,
    });
}; 

export const getACF = async (id: string) => {
    const resData = await axiosHelper({
        func_path: `/get-acf/${id}`,
        method: 'GET',
    });

    return resData;
};

export const editActingCapacity = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/edit-acting-capacity',
        method: 'POST',
        payload: payload,
        additionalHeaders: {
            "Content-Type": "multipart/form-data"
        }
    });

    return resData;
};

export const generateConfirmationPromotion = async (id: string, payload?: {}) => {
    const resData = await axiosHelper({
        func_path: `/generate-confirmation-promotion/${id}`,
        method: 'POST',
        payload: payload,
    });

    return resData;
};

export const confirmPromotion = async (id: string, payload?: {}) => {
    const resData = await axiosHelper({
        func_path: `/confirm-promotion/${id}`,
        method: 'POST',
        payload: payload,
        additionalHeaders: {
            "Content-Type": "multipart/form-data"
        }
    });

    return resData;
};

export const rejectPromotion = async (id: string, payload?: {}) => {
    const resData = await axiosHelper({
        func_path: `/reject-promotion/${id}`,
        method: 'POST',
        payload: payload,
    });

    return resData;
};