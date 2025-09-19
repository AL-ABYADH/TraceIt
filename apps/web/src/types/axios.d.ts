import "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    isPublic?: boolean; // if true, do not attach authentication header
  }
}
