import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { HttpService, URL_SERVER } from "../../../Shared/services/http/http.service";
import { Pedido } from "../../interfaces/pedido";


const routePedido = "pedido/";
@Injectable({
  providedIn: "root"
})
export class PedidoService {
  constructor(private httpService: HttpService, private http: HttpClient) {}

  getPedidos() {
    return this.httpService.get(routePedido);
  }

  getPedido(id: string) {
    return this.httpService.get(routePedido + id);
  }

  getPedidoByQuery(query: any) {
    return this.http.post<Pedido[]>(
      URL_SERVER + routePedido + "byquery",
      query
    );
  }

  addPedido(pedido: Pedido) {
    return this.httpService.post(routePedido, pedido);
  }

  updatePedido(id: string, pedido: any) {
    return this.httpService.put(routePedido + id, pedido);
  }

  deletePedido(id: string) {
    return this.httpService.delete(routePedido + id);
  }
}
