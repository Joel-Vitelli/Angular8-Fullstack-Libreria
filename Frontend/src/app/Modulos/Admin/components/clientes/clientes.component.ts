import { Component, OnInit, ViewChild } from "@angular/core";
import { trigger, state, style, transition, animate} from "@angular/animations";
import { MatTableDataSource, MatPaginator, MatSort, MatDatepickerInputEvent} from "@angular/material";

import { Cliente } from "../../interfaces/cliente";
import { ClienteService } from "../../services/cliente/cliente.service";
import { ConfirmDialogService } from "../../../Shared/services/confirm.dialog/confirm-dialog.service";
import { SnackBarService } from "../../../Shared/services/snack-bar/snack-bar.service";
import { ExcelService } from "../../../Shared/services/excel/excel.service";

@Component({
  selector: "app-clientes",
  templateUrl: "./clientes.component.html",
  styleUrls: ["./clientes.component.scss"],
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
export class ClientesComponent implements OnInit {
  dataSource: MatTableDataSource<Cliente> = new MatTableDataSource();
  columnsToDisplay = ["nombre", "email", "telefono", "creacion", "delete"];
  expandedElement: Cliente | null;
  initDate = new Date(Date.now());
  endDate = new Date(Date.now());

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private clienteService: ClienteService,
    private confirmService: ConfirmDialogService,
    private snackBarService: SnackBarService,
    private excelService: ExcelService
  ) {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getClientes();
  }

  async getClientes() {
    await this.initDate.setHours(0, 0, 0, 0);
    await this.endDate.setHours(23, 59, 59, 59);
    await this.clienteService
      .getClientesByQuery({
        creacion: {
          $gte: this.initDate.toISOString(),
          $lt: this.endDate.toISOString()
        }
      })
      .subscribe(pedidos => {
        this.dataSource.data = pedidos;
      });
  }

  deleteCliente(id: string, name: string) {
    console.log(id);
    this.confirmService
      .getConfirmation("¿Desea eliminar a " + name + "?")
      .then((c: boolean) => {
        if (c) {
          this.clienteService
            .deleteCliente(id)
            .toPromise()
            .then(() => {
              this.snackBarService.openSnackBar("Cliente " + name + " eliminado correctamente");
              this.getClientes();
            });
        }
      });
  }

  exportToExcel() {
    this.excelService.exportAsExcelFile(
      Array.from(this.dataSource.data),
      "Clientes"
    );
  }
}
