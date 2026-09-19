import { axiosHelper } from "../axios-config";

export const getWeightedAverage = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: "/get-weight-average",
        method: "GET",
        payload,
    });

    return resData;
};

export const exportAllWeightAverage = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: "/get-weight-average-export",
        method: "GET",
        payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
    });

    return resData;
};

export const updateUnitPrice = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: "/update-item-price",
        method: "POST",
        payload,
    })

    return resData;
}

export const exportWeightAverageDetails = async (id: number) => {
    const resData = await axiosHelper({
        func_path: `/export-weight-average/${id}/details`,
        method: "GET",
        responseType: "blob",
        additionalHeaders: {
            Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
    });

    return resData;
};

export const createWeightAverage = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: "/create-weight-average",
        method: "POST",
        payload,
    });

    return resData;
};

export const getWeightAverageItems = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: "/weight-average-items",
        method: "POST",
        payload,
    });

    return resData;
};

export const getWeightAverageById = async (id: number) => {
    const resData = await axiosHelper({
        func_path: `/weighted-average/${id}`,
        method: "GET",
    });

    return resData;
};

export const updateWeightStatus = async (id: number, payload:{status:string;items:{}}) => {
    const resData = await axiosHelper({
        func_path: `/weighted/${id}/status`,
        method: "POST",
        payload
    });

    return resData;
};

export const cancelWeightAverage = (id:number , payload:{cancel_reason: string}) => axiosHelper({
    func_path : `/uniform-weighted/${id}/cancel`,
    method:"POST",
    payload

});

