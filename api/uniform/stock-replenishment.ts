import { axiosHelper } from "../axios-config";

export const getStockOptions = () => axiosHelper({
    func_path: "/uniform-stock-options",
    method: "GET",
});

export const getReplenishments = (payload?: {}) => axiosHelper({
    func_path: "/uniform-replenishments",
    method: "GET",
    payload,
});

export const createReplenishment = (payload: {}) => axiosHelper({
    func_path: "/uniform-replenishments",
    method: "POST",
    payload,
});

export const reviewReplenishment = (id: number) => axiosHelper({
    func_path: `/uniform-replenishments/${id}/review`,
    method: "POST",
});

export const postReplenishment = (id: number) => axiosHelper({
    func_path: `/uniform-replenishments/${id}/post`,
    method: "POST",
});

export const cancelReplenishment = (id: number, reason: string) => axiosHelper({
    func_path: `/uniform-replenishments/${id}/cancel`,
    method: "POST",
    payload: { reason },
});

export const getReceivableReplenishments = () => axiosHelper({
    func_path: "/uniform-receivable-replenishments",
    method: "GET",
});

export const getReceivings = (payload?: {}) => axiosHelper({
    func_path: "/uniform-receivings",
    method: "GET",
    payload,
});

export const createReceiving = (payload: {}) => axiosHelper({
    func_path: "/uniform-receivings",
    method: "POST",
    payload,
});

export const reviewReceiving = (id: number) => axiosHelper({
    func_path: `/uniform-receivings/${id}/review`,
    method: "POST",
});

export const postReceiving = (id: number) => axiosHelper({
    func_path: `/uniform-receivings/${id}/post`,
    method: "POST",
});

export const cancelReceiving = (id: number, reason: string) => axiosHelper({
    func_path: `/uniform-receivings/${id}/cancel`,
    method: "POST",
    payload: { reason },
});
