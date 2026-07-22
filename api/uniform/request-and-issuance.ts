import { axiosHelper } from "../axios-config";

export const getAllRequestAndIssuance = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: "/get-uniform-request-and-issuance",
        method: "GET",
        payload: payload
    });

    return resData;
};

export const getDropDownMasterlist = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: "/get-drop-down-masterlist",
        method: "GET",
        payload,
    });

    return resData;
};

export const exportAllRequestAndIssuance = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: "/export-all-request-and-issuance",
        method: "GET",
        payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
    });

    return resData;
};

export const exportRequestAndIssuanceDetails = async (id: number) => {
    const resData = await axiosHelper({
        func_path: `/export-uniform-request-and-issuance/${id}/details`,
        method: "GET",
        responseType: "blob",
        additionalHeaders: {
            Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
    });

    return resData;
};

export const createUniformRequestAndIssuance = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: "/create-uniform-request-and-issuance",
        method: "POST",
        payload,
    });

    return resData;
};

export const reviewUniformRequestAndIssuance = async (id: number, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/uniform-request/${id}/review`,
        method: "POST",
        payload,
    });

    return resData;
};

export const updateRequestStatus = async (id: number, status: string) => {
    const resData = await axiosHelper({
        func_path: `/issuance/${id}/status`,
        method: "POST",
        payload: { status },
    });

    return resData;
};

export const cancelRequestAndIssuanceID = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/uniform-request/${id}/cancel`,
        method: "POST",
        payload,
    });

    return resData;
};
