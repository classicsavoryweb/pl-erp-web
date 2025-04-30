import { axiosHelper } from "./axios-config";

export const getAllOffenses = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-offenses',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const createOffense = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-offense',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editOffense = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-offense/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const getAllCategories = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-categories',
        method: 'GET',
        payload: payload
    });

    return resData;
};


export const getAllSubCategories = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-subcategories',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const getCategories = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-categories',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const getSubCategories = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-subcategories',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const createCategory = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-category',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editCategory = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-category/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const createSubCategory = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/create-subcategory',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const editSubCategory = async (payload: {}, id: number) => {
    const resData = await axiosHelper({
        func_path: `/edit-subcategory/${id}`,
        method: 'POST',
        payload: payload
    });

    return resData;
};