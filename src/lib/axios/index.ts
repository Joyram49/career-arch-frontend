import { IApiResponse } from '@app-types/api';
import { envConfig } from '@config/envConfig';
import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

/* ─────────────────────────────────────────────
   Axios instance
   withCredentials: true — JWT rides in HttpOnly cookies set by backend
   We never manually attach Authorization headers
   ──────────────────────────────────────────── */
const api: AxiosInstance = axios.create({
  baseURL: envConfig.apiUrl,
  withCredentials: true,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/* ── Request interceptor ── */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // No token attachment needed — HttpOnly cookie is sent automatically
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

/* ── Response interceptor ── */
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: AxiosResponse) => void;
  reject: (error: unknown) => void;
  config: InternalAxiosRequestConfig;
}> = [];

function processQueue(error: unknown): void {
  failedQueue.forEach(({ reject }) => {
    reject(error);
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response: AxiosResponse) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 401 Unauthorized — attempt token refresh
    if (
      error.response?.status === 401 &&
      originalRequest._retry !== true &&
      // Don't retry the refresh endpoint itself
      !originalRequest.url?.includes('refresh-token')
    ) {
      if (isRefreshing) {
        // Queue this request while refresh is in progress
        return new Promise<AxiosResponse>((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Detect role from cookie to call correct refresh endpoint
        // The role cookie is readable in browser (not HttpOnly)
        const role = document.cookie
          .split('; ')
          .find((row) => row.startsWith('userRole='))
          ?.split('=')[1];

        const refreshEndpoint =
          role === 'ORGANIZATION'
            ? '/auth/org/refresh-token'
            : role === 'ADMIN'
              ? '/auth/admin/refresh-token'
              : '/auth/user/refresh-token';

        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}${refreshEndpoint}`,
          {},
          { withCredentials: true },
        );

        // Retry original request — new cookie is now set
        const retried = await api(originalRequest);
        processQueue(null);
        return retried;
      } catch (refreshError) {
        processQueue(refreshError);

        // Refresh failed — clear state and redirect to login
        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname;
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // 429 Too Many Requests
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'];
      const message = retryAfter
        ? `Too many requests. Try again in ${retryAfter} seconds.`
        : 'Too many requests. Please slow down.';
      return Promise.reject(new Error(message));
    }

    return Promise.reject(error);
  },
);

/* ── Typed request helpers ── */
export async function apiGet<T>(
  url: string,
  params?: Record<string, unknown>,
): Promise<IApiResponse<T>> {
  const response = await api.get<IApiResponse<T>>(url, { params });
  return response.data;
}

export async function apiPost<T>(url: string, data?: unknown): Promise<IApiResponse<T>> {
  const response = await api.post<IApiResponse<T>>(url, data);
  return response.data;
}

export async function apiPut<T>(url: string, data?: unknown): Promise<IApiResponse<T>> {
  const response = await api.put<IApiResponse<T>>(url, data);
  return response.data;
}

export async function apiPatch<T>(url: string, data?: unknown): Promise<IApiResponse<T>> {
  const response = await api.patch<IApiResponse<T>>(url, data);
  return response.data;
}

export async function apiDelete<T>(url: string): Promise<IApiResponse<T>> {
  const response = await api.delete<IApiResponse<T>>(url);
  return response.data;
}

export async function apiUpload<T>(url: string, formData: FormData): Promise<IApiResponse<T>> {
  const response = await api.post<IApiResponse<T>>(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

export default api;
