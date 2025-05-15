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

export const updateEmployee = async ( employeeNumber: string, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/update-employee/${employeeNumber}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const addEmployeePosition = async ( employeeNumber: string, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/add-employee-position/${employeeNumber}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const updateEmployeePosition = async ( employeeNumber: string, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/edit-employee-position/${employeeNumber}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const addEmployeeBranch = async ( employeeNumber: string, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/add-employee-branch/${employeeNumber}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const updateEmployeeBranch = async ( employeeNumber: string, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/edit-employee-branch/${employeeNumber}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const addEmployeeContract = async ( employeeNumber: string, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/add-employee-contract/${employeeNumber}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const updateEmployeeContract = async ( employeeNumber: string, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/edit-employee-contract/${employeeNumber}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const getEmployeeBankDetailsHistory = async (employeeNumber: string, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/get-employee-bank-details/${employeeNumber}`,
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const addEmployeeBankDetails = async ( employeeNumber: string, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/add-employee-bank-details/${employeeNumber}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const updateEmployeeBankDetails = async ( employeeNumber: string, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/edit-employee-bank-details/${employeeNumber}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const getEmployeeOffensesHistory = async (employeeNumber: string, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/get-employee-offenses/${employeeNumber}`,
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const addEmployeeOffense = async ( employeeNumber: string, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/add-employee-offense/${employeeNumber}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const updateEmployeeOffense = async ( employeeNumber: string, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/edit-employee-offense/${employeeNumber}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};