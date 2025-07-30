import { axiosHelper } from "./axios-config";

export const getAllDatabaseBackups = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-database-backups',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const createDatabaseBackup = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-database-backup',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const downloadSqlFile = async (filename: string) => {
    const resData = await axiosHelper({
        func_path: `/download-sql-file/${filename}`,
        method: 'GET',
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/sql',
        }
    });

    return resData;
};