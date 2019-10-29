import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { HttpService, URL_SERVER } from "../../../Shared/services/http/http.service";
import { Horario } from "../../interfaces/horario";

@Injectable({
  providedIn: "root"
})
export class HorarioService {
  route = "apertura/";
  constructor(private http: HttpService, private httpClient: HttpClient) {}

  getHorarioSemanal(id?: string) {
    id = id ? id : "";
    return this.http.get(this.route + id);
  }

  updateHorario(id: string, dia: any) {
    return this.http.put(this.route + id, dia);
  }

  getHorarioByQuery(query: any) {
    return this.httpClient
      .post<Horario>(URL_SERVER + this.route + "byquery/", query)
      .toPromise()
      .then(data => {
        if (data) {
          return data;
        }
      })
      .catch(err => {
        console.log(err);
        return null;
      });
  }
}
