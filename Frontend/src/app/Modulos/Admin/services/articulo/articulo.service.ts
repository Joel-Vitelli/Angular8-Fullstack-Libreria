import { Injectable, Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { HttpService, URL_SERVER } from "../../../Shared/services/http/http.service";
import { Articulo } from "../../interfaces/articulo";

const route = "articulo/";
const routeOferta = "oferta/";
@Injectable({
  providedIn: "root"
})
export class ArticuloService {
  constructor(
    private httpService: HttpService,
    private httpCliente: HttpClient
  ) {}

  getArticulos() {
    return this.httpService.get(route);
  }
  getTotalSales() {
    return this.httpService.get("totalsales/");
  }
  getArticulosByQuery(query: any) {
    return this.httpCliente.post<Articulo[]>(
      URL_SERVER + route + "byquery/",
      query
    );
  }

  decreaseStock(queries: any) {
    return this.httpService.post(route + "decreasestock/", queries);
  }

  addArticulo(articulo: Articulo) {
    return this.httpService.post(route, articulo);
  }

  updateArticulo(id: string, articulo: Articulo) {
    return this.httpService.put(route + id, articulo);
  }

  deleteArticulo(id: string) {
    return this.httpService.delete(route + id);
  }

  getArticuloOferta() {
    return this.httpService.get(routeOferta);
  }
  addArticuloOferta(artOferta: any) {
    return this.httpService.post(routeOferta, artOferta);
  }
  updateArticuloOferta(id: string, artOferta: any) {
    return this.httpService.put(routeOferta + id , artOferta);
  }
  deleteArticuloOferta(id: string) {
    return this.httpService.delete(routeOferta + id);
  }
}
