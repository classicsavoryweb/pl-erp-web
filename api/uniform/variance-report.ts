import { axiosHelper } from "../axios-config";

export const getVariances = (payload?: {}) => axiosHelper({
    func_path: "/uniform-variances",
    method: "GET",
    payload,
});

export const exportVariances = (payload?: {}) => axiosHelper({
    func_path: "/export-uniform-variances",
    method: "GET",
    payload,
    responseType: "blob",
});

export const exportVarianceDetails = (id: number) => axiosHelper({
    func_path: `/export-uniform-variances/${id}/details`,
    method: "GET",
    responseType: "blob",
});
    
export const previewVariance = (payload: {}) => axiosHelper({
    func_path: "/uniform-variances/preview",
    method: "POST",
    payload,
});

export const createVariance = (payload: {}) => axiosHelper({
    func_path: "/uniform-variances",
    method: "POST",
    payload,
});

export const reviewVariance = (id: number, payload?: {}) => axiosHelper({
    func_path: `/uniform-variances/${id}/review`,
    method: "POST",
    payload,
});

export const postVariance = (id: number) => axiosHelper({
    func_path: `/uniform-variances/${id}/post`,
    method: "POST",
});

export const getVarianceById = async (id: number) => {
    const resData = await axiosHelper({
        func_path: `/uniform-variances/${id}`,
        method: "GET",
    });

    return resData;
};

export const cancelVariance = (id: number, cancel_reason: string) => axiosHelper({
    func_path: `/uniform-variances/${id}/cancel`,
    method: "POST",
    payload: { cancel_reason },
});

export const getVarianceItemDetails = (uniform_item_id:number,begin_date:string,end_date:string) => axiosHelper({
    func_path:`/variance-details`,
    method: "GET",
    payload:{uniform_item_id,begin_date,end_date}
});

