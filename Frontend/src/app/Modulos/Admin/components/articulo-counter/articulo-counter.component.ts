import { Component, OnInit } from "@angular/core";

import { ArticuloService } from "../../services/articulo/articulo.service";
import { ExcelService } from "../../../Shared/services/excel/excel.service";

@Component({
  selector: "app-articulo-counter",
  templateUrl: "./articulo-counter.component.html",
  styleUrls: ["./articulo-counter.component.scss"]
})
export class ArticuloCounterComponent implements OnInit {
  totalSales: any[] = [];
  constructor(
    private articuloService: ArticuloService,
    private excelService: ExcelService
  ) {}

  ngOnInit() {
    this.articuloService.getTotalSales().subscribe((data: any[]) => {
      if (data) {
        this.totalSales = data;
      }
    });
  }
  exportToExcel() {
    this.excelService.exportAsExcelFile(this.totalSales, "Mas-vendidos");
  }
}
