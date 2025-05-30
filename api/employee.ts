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

export const getEmployeesList = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-employees-list',
        method: 'GET',
        payload: payload
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
        payload: payload,
        additionalHeaders: {
            "Content-Type": "multipart/form-data"
        }
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
        payload: payload,
        additionalHeaders: {
            "Content-Type": "multipart/form-data"
        }
    });

    return resData;
};

export const getEmployeeRequirements = async (employeeNumber: string) => {
    const resData = await axiosHelper({
        func_path: `/get-employee-requirements/${employeeNumber}`,
        method: 'GET',
    });

    return resData;
};

export const updateOrCreateEmployeeRequirements = async ( employeeNumber: string, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/create-or-edit-employee-requirements/${employeeNumber}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const getEmployeeTrainings = async (employeeNumber: string, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/get-employee-trainings/${employeeNumber}`,
        method: 'GET',
    });

    return resData;
};

export const addEmployeeTrainingTitle = async ( employeeNumber: string, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/add-employee-training-title/${employeeNumber}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};


export const getEmployeeVaccination = async (employeeNumber: string, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/get-employee-vaccination/${employeeNumber}`,
        method: 'GET',
    });

    return resData;
};

export const addEmployeeVaccination = async ( employeeNumber: string, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/add-employee-vaccination/${employeeNumber}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editEmployeeVaccination = async ( employeeNumber: string, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/edit-employee-vaccination/${employeeNumber}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const getEmployeeHealthAndSafety = async (employeeNumber: string, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/get-employee-health-safety/${employeeNumber}`,
        method: 'GET',
    });

    return resData;
};

export const addEmployeeHealthAndSafety = async ( employeeNumber: string, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/add-employee-health-safety/${employeeNumber}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editEmployeeHealthAndSafety= async ( employeeNumber: string, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/edit-employee-health-safety/${employeeNumber}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const getEmployeeContractDetails = async (id: number) => {
    const resData = await axiosHelper({
        func_path: `/get-employee-contract-details/${id}`,
        method: 'GET',
    });

    return resData;
};