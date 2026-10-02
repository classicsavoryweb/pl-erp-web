import { axiosHelper } from "../axios-config";

export const getLiquidations = async (issuanceId: number) =>
    axiosHelper({ func_path: `/get-liquidations/${issuanceId}`, method: 'GET' });

export const getLiquidationsForReplenishment = async (replenishmentId: number) =>
    axiosHelper({ func_path: `/get-liquidations-for-replenishment/${replenishmentId}`, method: 'GET' });

export const getLiquidationAttachment = async (id: number) =>
    axiosHelper({ func_path: `/get-liquidation-attachment/${id}`, method: 'GET' });

export const createLiquidation = async (formData: FormData) =>
    axiosHelper({ func_path: '/create-liquidation', method: 'POST', payload: formData });

export const editLiquidation = async (formData: FormData, id: number) =>
    axiosHelper({ func_path: `/edit-liquidation/${id}`, method: 'POST', payload: formData });

export const voidLiquidation = async (id: number) =>
    axiosHelper({ func_path: `/void-liquidation/${id}`, method: 'POST' });

export const getExpenseTypes = async () =>
    axiosHelper({ func_path: '/get-expense-types', method: 'GET' });

export const postLiquidation = async (id: number, payload?: object) =>
    axiosHelper({ func_path: `/post-liquidation/${id}`, method: 'POST', payload });

export const getCSHubLiquidationCandidates = async (issuanceId: number, params?: object) =>
    axiosHelper({ func_path: `/get-cshub-liquidation-candidates/${issuanceId}`, method: 'GET', payload: params });

export const importCSHubLiquidations = async (issuanceId: number, payload: object) =>
    axiosHelper({ func_path: `/import-cshub-liquidations/${issuanceId}`, method: 'POST', payload });

export const auditCreateLiquidation = async (formData: FormData) =>
    axiosHelper({ func_path: '/audit-create-liquidation', method: 'POST', payload: formData });

export const auditEditLiquidation = async (formData: FormData, id: number) =>
    axiosHelper({ func_path: `/audit-edit-liquidation/${id}`, method: 'POST', payload: formData });

export const getLiquidationAuditLogs = async (replenishmentId: number) =>
    axiosHelper({ func_path: `/get-liquidation-audit-logs/${replenishmentId}`, method: 'GET' });
