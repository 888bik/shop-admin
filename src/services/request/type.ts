import type {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

export interface IInterceptors {
  requestSuccessFn?: (
    config: InternalAxiosRequestConfig
  ) => InternalAxiosRequestConfig;
  requestFailureFn?: (err: any) => any;
  responseSuccessFn?: (res: AxiosResponse) => AxiosResponse;
  responseFailureFn?: (err: any) => any;
}

export interface MyRequestConfig extends AxiosRequestConfig {
  interceptors?: IInterceptors;
}
