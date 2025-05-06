import axios from 'axios';
import Cookies from 'js-cookie';

interface dataType {
    func_path: string;
    method: 'POST' | 'GET';
    payload?: any;
};

const api_url = process.env.NEXT_PUBLIC_API_URL;

export const axiosHelper = async ({
    func_path,
    method,
    payload,
}: dataType) => {
    if (api_url === undefined) {
        return {
            status: 500,
            error: true,
            message: 'Internal Server Error',
        };
    }

    let headers: any = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    const token = Cookies.get('authToken');

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const apiUrl = `${api_url}${func_path}`;

    let newPayload;

    if (payload) {
        newPayload = Object.fromEntries(
            Object.entries(payload).filter(
                ([_, value]) => value !== null && value !== ''
            )
        );
    }

    const axiosConfig = {
        url: encodeURI(apiUrl),
        method,
        headers,
        data: method === 'POST' && newPayload,
        params: method === 'GET' && newPayload
    };

    try {
        const response = await axios(axiosConfig);

        return response.data;
    } 
    catch (err: any) {
        const { response } = err;
        if (response) {
            const errors = [502, 504, 500, 403, 409];
            if (errors.includes(response.status)) {
                return {
                    error: true,
                    status: response.status,
                    ...response,
                };
            }

            return response.data;
        }

        return {
            error: true,
            status: 500,
            message: err.message,
        };
    }
};