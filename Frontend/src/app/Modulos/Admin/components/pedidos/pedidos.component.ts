import { Component, OnInit, ViewChild } from "@angular/core";
import { state, style, transition, animate, trigger} from "@angular/animations";
import { MatPaginator, MatSort, MatTableDataSource, MatDatepickerInputEvent} from "@angular/material";

import { Pedido, EstadoPedido, TipoRetiro } from "../../interfaces/pedido";
import { SocketService } from "../../../Shared/services/socket/socket.service";
import { PedidoService } from "../../services/pedido/pedido.service";
import { ExcelService } from "../../../Shared/services/excel/excel.service";

@Component({
  selector: "app-pedidos",
  templateUrl: "./pedidos.component.html",
  styleUrls: ["./pedidos.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      )
    ])
  ]
})
export class PedidosComponent implements OnInit {
  dataSource: MatTableDataSource<Pedido> = new MatTableDataSource();
  columnsToDisplay = [
    "numero",
    "fecha",
    "estado",
    "horaEstimadaFin",
    "tipoEnvio"
  ];
  expandedElement: Pedido | null;
  initDate = new Date(Date.now());
  endDate = new Date(Date.now());
  estadoPedido = EstadoPedido;
  tipoRetiro = TipoRetiro;
  ListGruopByCliente: any[] = [];
  grouping = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(
    private socketService: SocketService,
    private pedidoService: PedidoService,
    private excelService: ExcelService
  ) {}

  ngOnInit() {
    this.getPedidos();
    this.socketService.socket.on("facturaAdded", () => {
      this.getPedidos();
    });
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async getPedidos() {
    await this.initDate.setHours(0, 0, 0, 0);
    await this.endDate.setHours(23, 59, 59, 59);
    console.log(this.initDate.toISOString());
    console.log(this.endDate.toISOString());
    await this.pedidoService
      .getPedidoByQuery({
        fecha: {
          $gte: this.initDate.toISOString(),
          $lt: this.endDate.toISOString()
        }
      })
      .subscribe(pedidos => {
        this.dataSource.data = pedidos;
        this.groupData();
      });
  }

  async groupData() {
    this.ListGruopByCliente = await this.groupBy(
      this.dataSource.data,
      product => product.cliente._id
    );
    console.log(this.ListGruopByCliente);
  }

  groupBy<T, K>(list: T[], getKey: (item: T) => K) {
    const map = new Map<K, T[]>();
    list.forEach(item => {
      const key = getKey(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return Array.from(map.values());
  }
  exportToExcel() {
    this.excelService.exportAsExcelFile(
      Array.from(this.dataSource.data),
      "Pedidos"
    );
  }
}
