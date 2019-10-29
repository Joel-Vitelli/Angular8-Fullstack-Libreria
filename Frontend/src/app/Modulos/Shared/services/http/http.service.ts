import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

export const URL_SERVER = "http://localhost:3000/";

@Injectable({
  providedIn: "root"
})
export class HttpService {
  constructor(private httpClient: HttpClient) {}

  get(route: string, data?: any) {
    return this.httpClient.get(URL_SERVER + route, { params: data });
  }

  post(route: string, body: any, params?: any) {
    return this.httpClient.post(URL_SERVER + route, body, params);
  }

  put(route: string, body: any) {
    return this.httpClient.put(URL_SERVER + route, body);
  }

  delete(route: string, data?: any) {
    return this.httpClient.delete(URL_SERVER + route, { params: data });
  }
}
