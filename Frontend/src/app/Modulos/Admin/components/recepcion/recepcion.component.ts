import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { PedidoService } from "../../../Admin/services/pedido/pedido.service";
import { SocketService } from "../../../Shared/services/socket/socket.service";
import { Pedido, TipoRetiro, EstadoPedido } from "../../../Admin/interfaces/pedido";
import { ConfirmDialogService } from "../../../Shared/services/confirm.dialog/confirm-dialog.service";
import { AuthService } from "../../../Shared/services/auth/auth.service";
import { UsersService } from "../../../Admin/services/users/users.service";
import { ArticuloService } from "../../../Admin/services/articulo/articulo.service";
import { DetallePedido } from "../../../Admin/interfaces/detalle-pedido";
import { SnackBarService } from "../../../Shared/services/snack-bar/snack-bar.service";

@Component({
  selector: "app-recepcion",
  templateUrl: "./recepcion.component.html",
  styleUrls: ["./recepcion.component.scss"]
})
export class RecepcionComponent implements OnInit {
  listPedido: Pedido[] = [];
  tipoRetiro = TipoRetiro;
  constructor(
    private pedidoService: PedidoService,
    private ioService: SocketService,
    private confirmDialog: ConfirmDialogService,
    private auth: AuthService,
    private userService: UsersService,
    private router: Router,
    private articuloService: ArticuloService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit() {
    this.auth.user.subscribe(u => {
      if (u) {
        this.userService.getPermissionsByUser(u.email).then(array => {
          if (array.length === 0) {
            this.snackBarService.openSnackBar(
              "No tiene permisos para acceder a esta zona"
            );
            this.auth.signOut();
            this.router.navigate(["/login"]);
          } else {
            this.getPedidos();
            this.ioService.socket.on("refreshPedido", () => {
              this.getPedidos();
            });
          }
        });
      }
    });
  }

  getPedidos() {
    this.pedidoService.getPedidoByQuery({ estado: 0 }).subscribe(p => {
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

  updatePedido(pedido: Pedido) {
    this.confirmDialog
      .getConfirmation(
        "¿Enviar pedido N° " + pedido.numero + " a facturación?"
      )
      .then((confirmation: boolean) => {
        if (confirmation) {
          this.pedidoService
            .updatePedido(pedido._id, { estado: 1 })
            .toPromise()
            .then(() => this.decreaseStock(pedido.detalles));
        }
      });
  }

  async decreaseStock(detalles: DetallePedido[]) {
    const list: any[] = [];

    for (const det of detalles) {
      // Itero en detalles.
      if (det.onModel === "articulo") {
        const q = await {
          _id: det.articulo._id,
          cantidad: det.cantidad
        };
        await list.push(q);
      } else {
        for (const a of det.articulo.detalle) {
          // Itero en detalle de los Oferta para multiplicar
          const qM = await {
            _id: a.articulo,
            cantidad: a.cantidad * det.cantidad // Multiplico la cantidad perida x cantidad de utilizado en MF
          };
          await list.push(qM);
        }
      }
    }
    await this.articuloService
      .decreaseStock(list)
      .toPromise()
      .then(() => {
        console.log("Actualizado");
      });
  }
  logOut() {
    this.auth.signOut();
  }
}
