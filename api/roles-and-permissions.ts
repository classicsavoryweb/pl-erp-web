import { axiosHelper } from "./axios-config";

export const getAllRolesAndPermissions = async (payload?: {}) => {
    const resData = await axiosHelper({
        func_path: '/get-all-roles-and-permissions',
        method: 'GET',
        payload: payload
    });

    return resData;
};
