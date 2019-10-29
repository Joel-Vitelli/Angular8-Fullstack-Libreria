import { Component, OnInit } from "@angular/core";
import { Rubro } from "../../interfaces/rubro";
import { RubroService } from "../../services/rubro/rubro.service";
import { SnackBarService } from "../../../Shared/services/snack-bar/snack-bar.service";

@Component({
  selector: "app-rubro-articulo",
  templateUrl: "./rubro-articulo.component.html",
  styleUrls: ["./rubro-articulo.component.scss"]
})
export class RubroArticuloComponent implements OnInit {
  rubros: Rubro[] = [];
  denomination = "";
  constructor(
    private rubroService: RubroService,
    private snackBar: SnackBarService
  ) {}

  ngOnInit() {
    this.getRubros();
  }

  getRubros() {
    this.rubroService.getRubros().subscribe((data: Rubro[]) => {
      if (data) {
        this.rubros = data;
      }
    });
  }

  addRubro() {
    const rubro = { denominacion: this.denomination };
    this.rubroService
      .addRubro(rubro)
      .toPromise()
      .then((data: any) => {
        this.rubros.push({ _id: data._id, denominacion: data.denominacion });
        this.denomination = "";
        this.snackBar.openSnackBar("Agregado!");
      });
  }

  deleteRubro(id: string) {
    this.rubroService
      .deleteRubro(id)
      .toPromise()
      .then(() => {
        this.rubros = this.rubros.filter(r => r._id !== id);
        this.snackBar.openSnackBar("Eliminado!");
      })
      .catch(err => {
        this.snackBar.openSnackBar(
          "Se ha producido un error. Intentelo nuevamente"
        );
        console.log(err);
      });
  }
}
