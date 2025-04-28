import { axiosHelper } from "./axios-config";

export const getAllRolesAndPermissions = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-roles-and-permissions',
        method: 'GET',
        payload: payload
    });

    return resData;
};

export const getAllPermissions = async () => {
    const resData = await axiosHelper({
        func_path: '/get-all-permissions',
        method: 'GET',
    });

    return resData;
};

export const getAllRoles = async () => {
    const resData = await axiosHelper({
        func_path: '/get-all-roles',
        method: 'GET',
    });

    return resData;
};

export const updateOrCreateRolesAndPermissions = async (payload: {}) => {
    const resData = await axiosHelper({
        func_path: '/update-or-create-roles-and-permissions',
        method: 'POST',
        payload: payload
    });

    return resData;
};

export const deleteRole = async (roleId: number) => {
    const resData = await axiosHelper({
        func_path: `/delete-role/${roleId}`,
        method: 'GET',
    });

    return resData;
};