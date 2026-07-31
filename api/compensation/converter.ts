import { axiosHelper } from "../axios-config";

export const getAllConverterDetails = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-converter-details',
        method: 'GET',
        payload: payload
    });

    return resData;

};

export const exportConverterDetails = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-converter-details',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    });

    return resData;
};

export const exportConverterBatchTransactions = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-converter-batch-transactions',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    });

    return resData;
};


export const getAllConverterMain = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-converter-main',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const getConverterTransactions = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-transactions',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const voidConverterDetails = async (id: number) => {
    const resData = await axiosHelper({
        func_path: `/void-converter-details/${id}`,
        method: 'GET',
    });

    return resData;
};

export const createConverterDetails = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-converter-details',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const importConverterTransactions = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/import-converter-transactions',
        method: 'POST',
        payload: payload,
        additionalHeaders: payload.hasOwnProperty('transactions_file')
            ? { "Content-Type": "multipart/form-data" }
            : {}
    });

    return resData;
};

export const editConverterDetails = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-converter-details/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const createConverterMain = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-converter-main',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const generateConverter = async (id:number) => {
    const resData = await axiosHelper({
        func_path: `/generate-converter/${id}`,
        method: 'GET',
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }
    });

    return resData;
};

export const voidBatchConverter = async (id:number) => {
    const resData = await axiosHelper({
        func_path: `/void-batch-convereter/${id}`,
        method: 'GET',
    });

    return resData;
};

export const postBatchConverter = async (id:number) => {
    const resData = await axiosHelper({
        func_path: `/post-batch-convereter/${id}`,
        method: 'GET',
    });

    return resData;
};

export const getCshubAppliedTransactions = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/get-cshub-applied-transactions`,
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const createCShubAppliedTransactions = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/create-cshub-applied-transactions`,
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const sendTransactionEmail = async (id:number, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/send-transaction-email/${id}`,
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const resendTransactionEmail = async (id:number, payload: {}) => {
    const resData = await axiosHelper({
        func_path: `/resend-transaction-email/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};
