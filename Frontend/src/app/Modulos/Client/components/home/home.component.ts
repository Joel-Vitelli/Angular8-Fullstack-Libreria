import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { startWith, map, min } from "rxjs/operators";
import { FormControl, FormGroup, FormBuilder } from "@angular/forms";

import { User } from "../../../Admin/interfaces/user";
import { Cliente } from "../../../Admin/interfaces/cliente";
import { AuthService } from "../../../Shared/services/auth/auth.service";
import { SnackBarService } from "../../../Shared/services/snack-bar/snack-bar.service";
import { ClienteService } from "../../../Admin/services/cliente/cliente.service";
import { Oferta } from "../../../Admin/interfaces/oferta";
import { Articulo } from "../../../Admin/interfaces/articulo";
import { ArticuloService } from "../../../Admin/services/articulo/articulo.service";
import { DetallePedido } from "../../../Admin/interfaces/detalle-pedido";
import { AmountDialogComponent } from "./amount-dialog/amount-dialog.component";
import { HorarioService } from "../../../Admin/services/horario/horario.service";
import { Horario } from "../../../Admin/interfaces/horario";
import { ConfirmDialogService } from "../../../Shared/services/confirm.dialog/confirm-dialog.service";
import { HourDialogComponent } from "./hour-dialog/hour-dialog.component";
import { Pedido } from "../../../Admin/interfaces/pedido";
import { PedidoService } from "../../../Admin/services/pedido/pedido.service";
import { UsersService } from "../../../Admin/services/users/users.service";
import { SocketService } from "../../../Shared/services/socket/socket.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  user: User = null;
  cliente: Cliente = null;
  form: FormGroup;
  filterControl = new FormControl("");
  listOferta: Oferta[] = [];
  listArticulo: Articulo[] = [];

  filteredArt: Observable<Articulo[]>;
  filteredOferta: Observable<Oferta[]>;

  listDetallePedido: DetallePedido[] = [];

  toAdressCheck = true;

  totalPedido: number = 0;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private authService: AuthService,
    private clientService: ClienteService,
    private articuloService: ArticuloService,
    private router: Router,
    private snackBarService: SnackBarService,
    private horarioService: HorarioService,
    private confirmDialog: ConfirmDialogService,
    private pedidoService: PedidoService,
    private userService: UsersService,
    private socket: SocketService
  ) { }

  ngOnInit() {
    this.socket.socket.on("refreshOferta", () => {
      this.getArticulosOfertas();
    })
    this.getUserandClient();
    this.getArticulos();
    this.getArticulosOfertas();
    this.form = this.fb.group({
      filterControl: this.filterControl
    });
  }

  getUserandClient() {
    this.authService.user.subscribe((u: User) => {
      if (u) {
        this.user = u;
        this.getClient(u.email);
      } else {
        this.user = null;
        this.cliente = null;
      }
    });
  }

  getClient(email: string) {
    this.clientService.getClienteByEmail(email).subscribe(c => {
      if (c) {
        this.cliente = c as Cliente;
      } else {
        this.userService
          .getPermissionsByUser(this.user.email)
          .then(a => {
            if (a.length === 0) {
              this.authService.signOut();
            } else {
              if (a.includes("admin")) {
                this.router.navigate(["/admin"]);
              } else {
                this.router.navigate(["/recepcion"]);
              }
            }
          })
          .catch();
      }
    });
  }

  getArticulos() {
    this.articuloService
      .getArticulosByQuery({ esInsumo: false })
      .subscribe((a: Articulo[]) => {
        this.listArticulo = a;
        this.filteredArt = this.filterControl.valueChanges.pipe(
          startWith(""),
          map(articulo =>
            articulo ? this.filterArticulo(articulo) : this.listArticulo.slice()
          )
        );
      });
  }

  getArticulosOfertas() {
    this.articuloService
      .getArticuloOferta()
      .subscribe((m: Oferta[]) => {
        this.listOferta = m;
        this.filteredOferta = this.filterControl.valueChanges.pipe(
          startWith(""),
          map(articulo =>
            articulo
              ? this.filterArticuloOferta(articulo)
              : this.listOferta.slice()
          )
        );
      });
  }
  private filterArticulo(value: string): Articulo[] {
    return this.listArticulo.filter(x =>
      x.denominacion.toLocaleLowerCase().includes(value.toLocaleLowerCase())
    );
  }
  private filterArticuloOferta(value: string): Oferta[] {
    return this.listOferta.filter(x =>
      x.nombre.toLocaleLowerCase().includes(value.toLowerCase())
    );
  }

  addToPedido(art: any, type: string) {
    const dialogRef = this.dialog.open(AmountDialogComponent, {
      width: "250px"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const calSubTotal =
          type === "articulo"
            ? Number.parseFloat(art.precioVenta) * result
            : Number.parseFloat(art.precio) * result;
        const detalle: DetallePedido = {
          cantidad: result,
          articulo: art,
          subtotal: calSubTotal,
          onModel: type
        };
        this.listDetallePedido.push(detalle);
        this.calculaTotal();
      }
    });
  }

  calculaTotal() {
    this.totalPedido =
      this.listDetallePedido.length > 0
        ? Number.parseFloat(
          this.listDetallePedido
            .map(a => a.subtotal)
            .reduce((a, b) => {
              return a + b;
            })
            .toFixed(2)
        )
        : 0;
  }

  deleteDetallePedido(index: number) {
    this.listDetallePedido.splice(index, 1);
    this.calculaTotal();
  }

  doPedido() {
    if (this.listDetallePedido.length === 0) {
      this.snackBarService.openSnackBar("Agrega articulos antes de hacer pedido");
    } else {
      this.getHorario();
    }
  }

  getHorario() {
    this.horarioService
      .getHorarioByQuery({
        nrodia: new Date(Date.now()).getDay()
      })
      .then((data: Horario) => {
        if (data) {
          this.compareHorarioApertura(data[0]);
        } else {
          this.snackBarService.openSnackBar(
            "Error, reintente mas tarde"
          );
        }
      })
      .catch(err => {
        console.log("Error");
        console.log(err);
      });
  }

  compareHorarioApertura(diaHorario: Horario) {
    const hsApertura = Number(
      diaHorario.apertura.split(":").filter(x => x !== "")[0]
    );
    const minApertura = Number(
      diaHorario.apertura.split(":").filter(x => x !== "")[1]
    );
    const hsCierre = Number(
      diaHorario.cierre.split(":").filter(x => x !== "")[0]
    );
    const minCierre = Number(
      diaHorario.cierre.split(":").filter(x => x !== "")[1]
    );

    const now = new Date(Date.now());

    // Seteo apertura
    const horaCompare = new Date(Date.now());
    horaCompare.setHours(hsApertura);
    horaCompare.setMinutes(minApertura);
    horaCompare.setSeconds(0);

    if (now < horaCompare) {
      // Hora si envio a domicilio seria a las hora de apertura + horario de coccion mayor.
      this.confirmPedido(horaCompare, diaHorario);
      return;
    }
    // Seteo cierre
    const hs = hsCierre !== 0 ? hsCierre : 23;
    const min = hsCierre !== 0 ? minCierre : 59;
    horaCompare.setHours(hs);
    horaCompare.setMinutes(min);
    horaCompare.setSeconds(0);

    if (now > horaCompare) {
      this.snackBarService.openSnackBar(
        "En estos momentos no brindamos atención, por favor, hazlo en los horarios habiles. Gracias."
      );
      return;
    }

    this.confirmPedido(now, diaHorario);
  }

  async confirmPedido(time: Date, horario?: Horario) {
    if (!this.toAdressCheck) {
      const coockingTime = await this.listDetallePedido
        .filter(x => x.onModel !== "articulo")
        .reduce((a, b) => {
          return a.articulo.tiempoDeCoccion >= b.articulo.tiempoDeCoccion
            ? a.articulo.tiempoDeCoccion
            : b.articulo.tiempoDeCoccion;
        });

      const addTime = typeof coockingTime === "number" ? coockingTime : 0;
      console.log(addTime);
      time.setMinutes(time.getMinutes() + addTime);

      this.confirmDialog
        .getConfirmation(
          "El pedido se terminara y enviara a las " +
          time
            .getHours()
            .toString()
            .padStart(2, "0") +
          ":" +
          time
            .getMinutes()
            .toString()
            .padStart(2, "0") +
          " Confirmar"
        )
        .then((confirmarion: boolean) => {
          if (confirmarion) {
            this.addPedido(time);
          }
        });
    } else {
      const refDialog = this.dialog.open(HourDialogComponent, {
        width: "350px",
        data: { horario: horario }
      });
      refDialog.afterClosed().subscribe(result => {
        if (result) {
          this.addPedido(result);
        }
      });
    }
  }

  addPedido(time: Date) {
    if (this.verifyCliente()) {
      const pedido: Pedido = {
        fecha: new Date(Date.now()),
        numero: 0,
        estado: 0,
        horaEstimadaFin: time,
        tipoEnvio: deliveryType[this.toAdressCheck.toString()],
        cliente: this.cliente,
        detalles: this.listDetallePedido.map(d => {
          return {
            cantidad: d.cantidad,
            articulo: d.articulo,
            onModel: d.onModel,
            subtotal: d.subtotal
          };
        })
      };
      this.pedidoService
        .addPedido(pedido)
        .toPromise()
        .then(data => {
          this.snackBarService.openSnackBar("Pedido completo");
          this.router.navigate(["/account"]);
          this.clearInfo();
        })
        .catch(err => {
          this.snackBarService.openSnackBar(
            "Ha ocurrido un error, por favor, intente nuevamente"
          );
          console.log(err);
        });
    }
  }

  clearInfo() {
    this.listDetallePedido = [];
    this.totalPedido = 0;
    this.toAdressCheck = false;
  }

  verifyCliente() {
    if (this.cliente) {
      return true;
    } else {
      return this.clientService
        .getClienteByEmail(this.user.email)
        .toPromise()
        .then((c: Cliente) => {
          if (!c && this.toAdressCheck) {
            this.snackBarService.openSnackBar(
              "Complete sus datos"
            );
            return false;
          }
          if (c.domicilio.calle.length === 0) {
            this.snackBarService.openSnackBar(
              "Ingrese domicilio, o retire en local"
            );
            return false;
          }
          this.cliente = c;
          return true;
        })
        .catch(err => {
          return false;
        });
    }
  }
}

export enum deliveryType {
  "true" = 0,
  "false" = 1
}
