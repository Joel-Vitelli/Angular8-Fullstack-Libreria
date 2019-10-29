import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { URL_SERVER } from "../../../Shared/services/http/http.service";

@Injectable({
  providedIn: "root"
})
export class UsersService {
  url = URL_SERVER + "user";

  constructor(private httpClient: HttpClient) { }

  getUsers() {
    return this.httpClient.get<any[]>(this.url);
  }

  getUserByEmail(email: string) {
    return this.httpClient.post<any>(this.url + "/email", { email });
  }

  async getPermissionsByUser(email: string) {
    let array = [];
    await this.getUserByEmail(email)
      .toPromise()
      .then(data => {
        if (data) {
          console.log(data);
          array = data[0].roles;
        }
      })
      .catch(err => {
        console.log(err);
      });
    return array;
  }

  addUser(user: any) {
    return this.httpClient.post<any>(this.url, user);
  }

  editUser(id: string, user: any) {
    return this.httpClient.put<any>(this.url + "/" + id, user);
  }

  deleteUser(id: string) {
    return this.httpClient.delete<any>(this.url + "/" + id);
  }
}
