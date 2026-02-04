import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  AxiosError,
} from 'axios';

// 全局 token 获取器（可在应用入口设置）
let tokenGetter: (() => string | undefined) | null = null;

export const setTokenGetter = (getter: () => string | undefined) => {
  tokenGetter = getter;
};

// 默认实例（通用请求入口）
const defaultInstance = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 默认拦截器（可在外部覆盖）
defaultInstance.interceptors.request.use(
  (config) => {
    const token = tokenGetter ? tokenGetter() : undefined;
    if (token && !config.headers?.Authorization) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

defaultInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => Promise.reject(error)
);

// 创建带自定义配置的实例
export const createAxios = (config?: AxiosRequestConfig): AxiosInstance => {
  const instance = axios.create({
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
    ...config,
  });

  instance.interceptors.request.use(
    (cfg) => {
      const token = tokenGetter ? tokenGetter() : undefined;
      if (token && !cfg.headers?.Authorization) {
        cfg.headers = cfg.headers || {};
        cfg.headers.Authorization = `Bearer ${token}`;
      }
      return cfg;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => Promise.reject(error)
  );

  return instance;
};

// 通用请求方法（默认实例）
export const request = <T = any>(
  config: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  return defaultInstance.request<T>(config);
};

// 常用方法封装（默认实例）
export const get = <T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  return defaultInstance.get<T>(url, config);
};

export const post = <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  return defaultInstance.post<T>(url, data, config);
};

export const put = <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  return defaultInstance.put<T>(url, data, config);
};

export const del = <T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  return defaultInstance.delete<T>(url, config);
};

export type { AxiosInstance, AxiosRequestConfig, AxiosResponse };

/**
 * 使用示例：
 *
 * 1) 普通请求
 * request({ url: '/api/list', method: 'GET' });
 *
 * 2) 上传文件（FormData）
 * const form = new FormData();
 * form.append('file', file);
 * post('/upload', form, {
 *   headers: { 'Content-Type': 'multipart/form-data' },
 *   onUploadProgress: (e) => {
 *     const percent = e.total ? (e.loaded / e.total) * 100 : 0;
 *     console.log('progress', percent);
 *   },
 * });
 *
 * 3) 创建实例
 * const api = createAxios({ baseURL: 'http://localhost:3001' });
 * api.get('/files');
 *
 * 4) 设置 token
 * setTokenGetter(() => localStorage.getItem('token') || undefined);
 */
