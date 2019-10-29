import { Component, OnInit, ViewChild, Inject } from "@angular/core";
import { MatTableDataSource, MatPaginator, MatSort, MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import { Observable } from "rxjs";
import { startWith, map } from "rxjs/operators";

import { Articulo } from "../../interfaces/articulo";
import { ArticuloService } from "../../services/articulo/articulo.service";
import { FormGroup, FormControl, FormBuilder, Validators} from "@angular/forms";
import { Rubro } from "../../interfaces/rubro";
import { RubroService } from "../../services/rubro/rubro.service";
import { SnackBarService } from "../../../Shared/services/snack-bar/snack-bar.service";
import { ConfirmDialogService } from "../../../Shared/services/confirm.dialog/confirm-dialog.service";
import { SocketService } from "../../../Shared/services/socket/socket.service";
import { ExcelService } from '../../../Shared/services/excel/excel.service';


@Component({
  selector: "app-articulo",
  templateUrl: "./articulo.component.html",
  styleUrls: ["./articulo.component.scss"]
})
export class ArticuloComponent implements OnInit {
  displayedColumns: string[] = [
    "denominacion",
    "precioCompra",
    "precioVenta",
    "stockActual",
    "unidadMedidad",
    "esInsumo",
    "rubro",
    "delete"
  ];
  dataSource: MatTableDataSource<Articulo> = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private articuloService: ArticuloService,
    public dialog: MatDialog,
    private snackBar: SnackBarService,
    private confimService: ConfirmDialogService,
    private ioService: SocketService,
    private excelService: ExcelService
  ) {}

  ngOnInit() {
    this.getArticulos();
    this.ioService.socket.on("refreshArticulo", () => {
      this.getArticulos();
    });
    this.ioService.socket.on("refreshArticuloXStock", () => {
      this.getArticulos();
    });
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getArticulos() {
    this.articuloService.getArticulos().subscribe((data: Articulo[]) => {
      this.dataSource.data = data;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteArticulo(art: Articulo) {
    this.confimService
      .getConfirmation("Esta seguro de eliminar el articulo?")
      .then((confirmation: boolean) => {
        if (confirmation) {
          this.articuloService
            .deleteArticulo(art._id)
            .toPromise()
            .then(() => {
              this.snackBar.openSnackBar(
                "Se elimino el articulo: " + art.denominacion
              );
            })
            .catch(err => {
              console.log(err);
              if (err && err.status === 403) {
                this.snackBar.openSnackBar(
                  "No se puede eliminar. Este articulo ya fue utlizado para una Oferta o se encuentra en un Pedido"
                );
              } else {
                this.snackBar.openSnackBar(
                  "Hubo un error inesperado intente nuevamente"
                );
              }
            });
        }
      });
  }

  addArticulo(data: any) {
    this.articuloService
      .addArticulo(data)
      .toPromise()
      .then(() => {
        this.snackBar.openSnackBar("Se agregó correctamente el articulo");
      })
      .catch(err => {
        this.snackBar.openSnackBar("Se ha producido un error, intente nuevamente");
        console.log(err);
      });
  }

  updateArticulo(id: string, data: any) {
    this.articuloService
      .updateArticulo(id, data)
      .toPromise()
      .then(() => {
        this.snackBar.openSnackBar("Se actualizo el articulo");
      })
      .catch(err => {
        this.snackBar.openSnackBar("Se ha producido un error :(");
      });
  }

  openDialog(articulo?: Articulo) {
    // tslint:disable-next-line: no-use-before-declare
    const dialogRef = this.dialog.open(ArticuloDialogComponent, {
      width: "400px",
      data: { articulo }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (result.action === "add") {
          this.addArticulo(result.articulo);
        } else {
          this.updateArticulo(articulo._id, result.articulo);
        }
      }
    });
  }

  exportToExcel() {
    this.excelService.exportAsExcelFile(Array.from(this.dataSource.data), "Articulos");
  }
}

@Component({
  selector: "app-articulo-dialog",
  templateUrl: "articulo-dialog.html"
})
export class ArticuloDialogComponent implements OnInit {
  form: FormGroup;
  art: Articulo;

  rubros: Rubro[] = [];
  filteredOptions: Observable<Rubro[]>;
  rubroControl = new FormControl("", [Validators.required]);

  constructor(
    private rubroService: RubroService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ArticuloDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.hasOwnProperty("articulo") && data.articulo) {
      this.art = data.articulo;
    } else if (data) {
      this.art = data as Articulo;
    }
  }

  ngOnInit() {
    this.rubroService.getRubros().subscribe(data => {
      this.rubros = data as Rubro[];
      this.filteredOptions = this.rubroControl.valueChanges.pipe(
        startWith(""),
        map(value => this._filter(value))
      );
    });
    this.rubroControl.setValue(this.art.rubro);
    this.form = this.fb.group({
      denominacion: [
        this.art.denominacion || "",
        [Validators.required, Validators.maxLength(60)]
      ],
      precioCompra: [
        this.art.precioCompra || "",
        [Validators.required, Validators.min(0)]
      ],
      precioVenta: [this.art.precioVenta, [Validators.min(0)]],
      stockActual: [
        this.art.stockActual,
        [Validators.required, Validators.min(0)]
      ],
      unidadMedidad: [this.art.unidadMedidad || "", [Validators.maxLength(25)]],
      checkbox: this.art.esInsumo || false,
      rubro: this.rubroControl.setValue(this.art.rubro || "")
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onConfirmClick() {
    const articulo = {
      denominacion: this.form.controls.denominacion.value,
      precioCompra: this.form.controls.precioCompra.value,
      precioVenta: this.form.controls.precioVenta.value,
      stockActual: this.form.controls.stockActual.value,
      esInsumo: this.form.controls.checkbox.value,
      unidadMedidad: this.form.controls.unidadMedidad.value,
      rubro: this.rubroControl.value
    };
    this.dialogRef.close({ action: this.art._id ? "update" : "add", articulo });
  }

  private _filter(value: string): Rubro[] {
    return this.rubros.filter(option =>
      option.denominacion.toLowerCase().includes(value.toLocaleLowerCase())
    );
  }

  private checkRubro() {
    const exist = this.rubros.find(
      r => r.denominacion === this.rubroControl.value
    );
    return exist ? true : false;
  }
}
