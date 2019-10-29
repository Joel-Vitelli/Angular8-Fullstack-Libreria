import { Pedido } from "./pedido";
import { DetallePedido } from "./detalle-pedido";

export interface Factura {
  _id?: string;
  numero?: number;
  fecha: Date;
  montoDescuento: number;
  total: number;
  pedido: Pedido;
  detalles: DetallePedido[];
}
