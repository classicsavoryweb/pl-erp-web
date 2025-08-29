import { axiosHelper } from "../axios-config";
    
export const getAllAdjustmentTypes = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-adjustment-types',
        method: 'GET',
        payload: payload
    })

    return resData;
};

export const exportAllAdjustmentTypes = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/export-all-adjustment-types',
        method: 'GET',
        payload: payload,
        responseType: "blob",
        additionalHeaders: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    });

    return resData;
};

export const getAdjustmentTypes = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-adjustment-types',
        method: 'GET',
        payload: payload
    });

    return resData;
}

export const createAdjustmentType = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-adjustment-type',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editAdjustmentType = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-adjustment-type/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};