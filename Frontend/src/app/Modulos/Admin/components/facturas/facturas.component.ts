import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource, MatPaginator, MatSort, MatDatepickerInputEvent} from "@angular/material";
import { trigger, state, style, transition, animate} from "@angular/animations";

import { SocketService } from "../../../Shared/services/socket/socket.service";
import { FacturaService } from "../../services/factura/factura.service";
import { ExcelService } from "../../../Shared/services/excel/excel.service";
import { Factura } from "../../interfaces/factura";

@Component({
  selector: "app-facturas",
  templateUrl: "./facturas.component.html",
  styleUrls: ["./facturas.component.scss"],
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
export class FacturasComponent implements OnInit {
  dataSource: MatTableDataSource<Factura> = new MatTableDataSource();
  columnsToDisplay = ["numero", "fecha", "total"];
  expandedElement: Factura | null;
  initDate = new Date(Date.now());
  endDate = new Date(Date.now());

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private socketService: SocketService,
    private facturaService: FacturaService,
    private excelService: ExcelService
  ) {}

  ngOnInit() {
    //
    this.getFacturas();
    this.socketService.socket.on("facturaAdded", () => {
      this.getFacturas();
    });
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async getFacturas() {
    await this.initDate.setHours(0, 0, 0, 0);
    await this.endDate.setHours(23, 59, 59, 59);
    await this.facturaService
      .getByQuery({
        fecha: {
          $gte: this.initDate.toISOString(),
          $lt: this.endDate.toISOString()
        }
      })
      .subscribe(facs => {
        this.dataSource.data = facs;
      });
  }

  getTotalFacturado() {
    return this.dataSource.data
      .map(t => t.total)
      .reduce((acc, value) => acc + value, 0);
  }

  exportToExcel() {
    this.excelService.exportAsExcelFile(
      Array.from(this.dataSource.data),
      "Facturas"
    );
  }
}
