import { Component, OnInit } from "@angular/core";

import { PedidoService } from "../../../services/pedido/pedido.service";
import { Pedido, EstadoPedido, TipoRetiro } from "../../../interfaces/pedido";
import { ConfirmDialogService } from "../../../../Shared/services/confirm.dialog/confirm-dialog.service";
import { DetallePedido } from "../../../interfaces/detalle-pedido";
import { Factura } from "../../../interfaces/factura";
import { FacturaService } from "../../../services/factura/factura.service";
import { SnackBarService } from "../../../../Shared/services/snack-bar/snack-bar.service";
import { SocketService } from "../../../../Shared/services/socket/socket.service";

@Component({
  selector: "app-pedidos-sin-factura",
  templateUrl: "./pedidos-sin-factura.component.html",
  styleUrls: ["./pedidos-sin-factura.component.scss"]
})
export class PedidosSinFacturaComponent implements OnInit {
  listPedido: Pedido[] = [];
  estadoPedido = EstadoPedido;
  tipoRetiro = TipoRetiro;
  constructor(
    private pedidoService: PedidoService,
    private confirmDialog: ConfirmDialogService,
    private facturaService: FacturaService,
    private snackBarService: SnackBarService,
    private socketService: SocketService
  ) {}

  ngOnInit() {
    this.getPedidos();
    this.socketService.socket.on("refreshPedido", () => {
      this.getPedidos();
    });
  }

  getPedidos() {
    this.pedidoService.getPedidoByQuery({ estado: 1 }).subscribe(p => {
      if (p) {
        console.log(p);
        this.listPedido = p.sort((a, b) => {
          if (a.fecha > b.fecha) {
            return 1;
          }
          if (a.fecha < b.fecha) {
            return -1;
          }
          return 0;
        });
      }
    });
  }

  createFacturaFromPedido(pedido: Pedido) {
    this.confirmDialog
      .getConfirmation("¿Crear Comprobante del pedido N° " + pedido.numero + " ?")
      .then((confirmation: boolean) => {
        if (confirmation) {
          this.pedidoService
            .updatePedido(pedido._id, { estado: 2 })
            .toPromise()
            .then(() => this.addFactura(pedido))
            .catch(() => {
              this.snackBarService.openSnackBar(
                "Error, reintente mas tarde"
              );
            });
        }
      });
  }

  async addFactura(pedido: Pedido) {
    const descuentoPedido =
      (await pedido.tipoEnvio) != 0
        ? (this.getTotal(pedido.detalles) * 1) / 100
        : 0;
    const totalPedido =
      (await this.getTotal(pedido.detalles)) - descuentoPedido;

    const factura: Factura = await {
      fecha: new Date(Date.now()),
      montoDescuento: descuentoPedido,
      total: totalPedido,
      detalles: pedido.detalles,
      pedido: pedido
    };
    await this.facturaService
      .addFactura(factura)
      .toPromise()
      .then(f => {
        this.snackBarService.openSnackBar(
          "Comprobante N° " + f.numero + " creado correctamente"
        );
      })
      .catch(() => {
        this.snackBarService.openSnackBar(
          "Error al crear comprobante, reintente mas tarde"
        );
      });
  }

  getTotal(detalles: DetallePedido[]) {
    return detalles
      .map(d => d.subtotal)
      .reduce((a, b) => {
        return a + b;
      });
  }
}
