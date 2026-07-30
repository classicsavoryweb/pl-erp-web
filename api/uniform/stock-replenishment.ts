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

export const exportReplenishmentDetails = (id: number) => axiosHelper({
    func_path: `/export-uniform-replenishments/${id}/details`,
    method: "GET",
    responseType: "blob",
});

export const createReplenishment = (payload: {}) => axiosHelper({
    func_path: "/uniform-replenishments",
    method: "POST",
    payload,
});

export const generateReplenishmentList = (payload: {}) => axiosHelper({
    func_path: "/uniform-replenishments/generate-list",
    method: "POST",
    payload,
});

export const importReplenishmentItems = (payload: any) => axiosHelper({
    func_path: "/uniform-replenishments/import-items",
    method: "POST",
    payload,
    additionalHeaders: payload.hasOwnProperty("supplier_item_file")
        ? { "Content-Type": "multipart/form-data" }
        : {},
});

export const reviewReplenishment = (id: number, payload: any) => axiosHelper({
    func_path: `/uniform-replenishments/${id}/review`,
    method: "POST",
    payload,
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

export const replaceReplenishmentSupplier = (id: number, supplierId: string | number) => axiosHelper({
    func_path: `/uniform-replenishments/${id}/replace-supplier`,
    method: "POST",
    payload: { supplier_id: supplierId },
});

export const closeReplenishment = (id: number, reason: string) => axiosHelper({
    func_path: `/uniform-replenishments/${id}/close`,
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

export const exportReceivingDetails = (id: number) => axiosHelper({
    func_path: `/export-uniform-receivings/${id}/details`,
    method: "GET",
    responseType: "blob",
});

export const createReceiving = (payload: {}) => axiosHelper({
    func_path: "/uniform-receivings",
    method: "POST",
    payload,
});

export const reviewReceiving = (id: number ,payload : any) => axiosHelper({
    func_path: `/uniform-receivings/${id}/review`,
    method: "POST",
    payload
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
