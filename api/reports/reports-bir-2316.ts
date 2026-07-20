import { axiosHelper } from "../axios-config";

export const getAllBir2316 = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: "/bir-2316",
        method: "GET",
        payload: payload
    });

    return resData;
};

export const exportAllBir2316 = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: "/bir-2316",
        method: "GET",
        payload: { ...payload, export: true },
        responseType: "blob",
        additionalHeaders: {
            Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }
    });

    return resData;
};

export const getBir2316 = async (id: string) => {
    const resData = await axiosHelper({
        func_path: `/bir-2316/${id}`,
        method: "GET"
    });

    return resData;
};

export const importBir2316 = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: "/bir-2316/import",
        method: "POST",
        payload: payload,
        additionalHeaders: {
            "Content-Type": "multipart/form-data"
        }
    });

    return resData;
};

export const getBir2316Signatory = async () => {
    const resData = await axiosHelper({
        func_path: "/bir-2316/signatory",
        method: "GET"
    });

    return resData;
};

export const exportBir2316Report = async (id: string, withSignature: boolean, signatoryName: string) => {
    const query = new URLSearchParams({
        with_signature: withSignature ? "1" : "0",
        signatory_name: signatoryName ?? "",
    });

    const resData = await axiosHelper({
        func_path: `/export-bir-2316/${id}?${query.toString()}`,
        method: "GET",
        responseType: "blob",
        additionalHeaders: {
            Accept: "application/pdf",
        }
    });

    return resData;
};
