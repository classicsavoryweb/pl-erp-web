import { axiosHelper } from "./axios-config";

export const getAllEmployees = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-employees',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const getEmployee = async (employeeNumber: string) => {
    const resData = await axiosHelper({
        func_path: `/get-employee/${employeeNumber}`,
        method: 'GET',
    });

    return resData;
};

export const getEmployees = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-employees',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const addEmployee = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/add-employee',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const getEmployeeAuditLogs = async (employeeNumber: string, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/get-employee-audit-logs/${employeeNumber}`,
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const getEmployeePositions = async (employeeNumber: string, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/get-employee-positions/${employeeNumber}`,
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const getEmployeeBranchhes = async (employeeNumber: string, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/get-employee-branches/${employeeNumber}`,
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const getEmployeeContractHistory = async (employeeNumber: string, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/get-employee-contracts/${employeeNumber}`,
        method: 'GET',
        payload: payload
    });

    return resData;
};