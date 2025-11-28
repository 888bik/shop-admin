import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import type { MyRequestConfig } from "./type";
import Cookies from "js-cookie";
import { toast } from "@/assets/base-ui/toast";
import { getToken } from "@/utils/auth";

class MyRequest {
  instance: AxiosInstance;

  constructor(config: MyRequestConfig) {
    this.instance = axios.create(config);
    //添加全局拦截器
    //请求拦截,可以针对每个请求拦截处理,比如添加token
    this.instance.interceptors.request.use(
      (config) => {
        //将token添加到请求头中
        const token = getToken("admin-token");
        if (token) {
          config.headers["token"] = token;
        }
        return config;
      },
      (err) => {
        throw err;
      }
    );
    //响应拦截器
    this.instance.interceptors.response.use(
      (res) => {
        return res.data;
      },
      (err) => {
        //提示失败
        //ToDo
        // toast("登录失败", "请检查账号或密码是否正确", "error");
        throw err;
      }
    );

    //针对个别请求添加拦截
    this.instance.interceptors.request.use(
      config.interceptors?.requestSuccessFn,
      config.interceptors?.requestFailureFn
    );
    this.instance.interceptors.response.use(
      config.interceptors?.responseSuccessFn,
      config.interceptors?.responseFailureFn
    );
  }

  request(config: AxiosRequestConfig) {
    return this.instance.request(config);
  }
  get() {}
  post() {}
}
export default MyRequest;
