import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import type { MyRequestConfig } from "./type";
import { toast } from "@/assets/base-ui/toast";
import { getToken } from "@/utils/auth";
import camelcaseKeys from "camelcase-keys";

class MyRequest {
  instance: AxiosInstance;

  constructor(config: MyRequestConfig) {
    this.instance = axios.create(config);
    //添加全局拦截器
    //请求拦截,可以针对每个请求拦截处理,比如添加token
    this.instance.interceptors.request.use(
      (config) => {
        //将token添加到请求头中
        const token = getToken("accessToken");
        if (token) config.headers["accessToken"] = token;

        return config;
      },
      (err) => {
        return Promise.reject(err);
      }
    );
    //响应拦截器
    this.instance.interceptors.response.use(
      (res: AxiosResponse) => {
        if (res.data) {
          res.data = camelcaseKeys(res.data, { deep: true });
        }
        return res.data.data;
      },
      (err) => {
        const msg = err?.response?.data?.msg || "请求失败";
        toast("请求错误", msg, "error");
        return Promise.reject(err);
      }
    );

    //针对个别请求添加拦截
    if (config.interceptors) {
      const {
        requestSuccessFn,
        requestFailureFn,
        responseSuccessFn,
        responseFailureFn,
      } = config.interceptors;

      requestSuccessFn &&
        this.instance.interceptors.request.use(
          requestSuccessFn,
          requestFailureFn
        );
      responseSuccessFn &&
        this.instance.interceptors.response.use(
          responseSuccessFn,
          responseFailureFn
        );
    }
  }

  request<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.instance.request(config);
  }
  get<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, url, method: "GET" });
  }

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, url, data, method: "POST" });
  }

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, url, data, method: "PUT" });
  }

  delete<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, url, method: "DELETE" });
  }
}

export default MyRequest;
