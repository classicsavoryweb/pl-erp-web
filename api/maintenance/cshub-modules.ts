import { axiosHelper } from "../axios-config";

export const getCSHubModules = async () => {
    const resData = await axiosHelper({
        func_path: '/get-cshub-modules',
        method: 'GET',
    })

    return resData;
};