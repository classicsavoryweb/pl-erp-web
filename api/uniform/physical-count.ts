import { axiosHelper } from "../axios-config";

export const getPhysicalCounts = (payload?: {}) => axiosHelper({
    func_path: "/uniform-physical-counts",
    method: "GET",
    payload,
});

export const exportPhysicalCounts = (payload?: {}) => axiosHelper({
    func_path: "/export-uniform-physical-counts",
    method: "GET",
    payload,
    responseType: "blob",
});

export const exportPhysicalCountDetails = (id: number) => axiosHelper({
    func_path: `/export-uniform-physical-counts/${id}/details`,
    method: "GET",
    responseType: "blob",
});

export const previewPhysicalCount = (payload: {}) => axiosHelper({
    func_path: "/uniform-physical-counts/preview",
    method: "POST",
    payload,
});

export const createPhysicalCount = (payload: {}) => axiosHelper({
    func_path: "/uniform-physical-counts",
    method: "POST",
    payload,
});

export const reviewPhysicalCount = (id: number, payload?: {}) => axiosHelper({
    func_path: `/uniform-physical-counts/${id}/review`,
    method: "POST",
    payload,
});

export const postPhysicalCount = (id: number) => axiosHelper({
    func_path: `/uniform-physical-counts/${id}/post`,
    method: "POST",
});

export const cancelPhysicalCount = (id: number, cancel_reason: string) => axiosHelper({
    func_path: `/uniform-physical-counts/${id}/cancel`,
    method: "POST",
    payload: { cancel_reason },
});
