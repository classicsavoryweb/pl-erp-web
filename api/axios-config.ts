import axios from 'axios';
import Cookies from 'js-cookie';

interface dataType {
    func_path: string;
    method: 'POST' | 'GET';
    payload?: any;
    additionalHeaders?: any;
};

const api_url = process.env.NEXT_PUBLIC_API_URL;

export const axiosHelper = async ({
    func_path,
    method,
    payload,
    additionalHeaders
}: dataType) => {
    if (api_url === undefined) {
        return {
            status: 500,
            error: true,
            message: 'Internal Server Error',
        };
    }

    let headers: any = {
        'Accept': 'application/json',
    };

    if (additionalHeaders) {
        headers = {
            ...headers,
            ...additionalHeaders
        };
    } else {
        headers = {
            ...headers,
            "Content-Type": "application/json"
        };
    }

    const token = Cookies.get('authToken');

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const apiUrl = `${api_url}${func_path}`;

    let newPayload;

    if (payload) {
        newPayload = cleanPayload(payload);
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

function cleanPayload(payload: any): any {
  if (payload instanceof File || payload instanceof Blob) {
    return payload;
  }

  if (Array.isArray(payload)) {
    return payload
      .map((item) => cleanPayload(item))
      .filter((item) => item !== null && item !== '');
  }

  if (typeof payload === 'object' && payload !== null) {
    return Object.fromEntries(
      Object.entries(payload)
        .map(([key, value]) => [key, cleanPayload(value)])
        .filter(([_, value]) => value !== null && value !== '')
    );
  }

  return payload;
}