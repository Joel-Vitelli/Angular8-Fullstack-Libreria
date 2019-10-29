import { Component, OnInit, Input } from "@angular/core";
import { Observable } from "rxjs";
import { startWith, map } from "rxjs/operators";
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl, ValidatorFn, ValidationErrors} from "@angular/forms";

import { ArticuloService } from "../../../services/articulo/articulo.service";
import { Articulo } from "../../../interfaces/articulo";
import { SnackBarService } from "../../../../Shared/services/snack-bar/snack-bar.service";
import { Oferta } from "../../../interfaces/oferta";

@Component({
  selector: "app-edit-oferta",
  templateUrl: "./edit-oferta.component.html",
  styleUrls: ["./edit-oferta.component.scss"]
})
export class EditOfertaComponent implements OnInit {
  @Input() artOfertaRef: Oferta = null;

  form: FormGroup;
  groupDetalle: FormGroup;
  artCtrl = new FormControl("", [Validators.required]);
  filteredArt: Observable<Articulo[]>;
  listArticulos: Articulo[] = [];
  detalleArticulos: any[] = [];

  constructor(
    private articuloService: ArticuloService,
    private snackBar: SnackBarService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      nombre: ["", [Validators.required, Validators.maxLength(60)]],
      precio: [
        "",
        Validators.compose([
          Validators.required,
          Validators.min(0),
          greaterThanZeroValidator()
        ])
      ],
      tiempoDeCoccion: [
        0,
        [Validators.required, Validators.min(0), Validators.pattern("^[0-9]*$")]
      ]
    });

    this.groupDetalle = this.fb.group({
      cantidadCtrl: [
        "",
        Validators.compose([
          Validators.required,
          Validators.min(0),
          greaterThanZeroValidator()
        ])
      ],
      artCtrl: this.artCtrl
    });

    this.articuloService.getArticulos().subscribe((data: Articulo[]) => {
      this.listArticulos = data;
      this.filteredArt = this.artCtrl.valueChanges.pipe(
        startWith(""),
        map(articulo =>
          articulo ? this._filter(articulo) : this.listArticulos.slice()
        )
      );
    });

    this.setValues();
  }

  private _filter(value: any): Articulo[] {
    if (!value) {
      console.log("Valor nulo");
      return this.listArticulos;
    }
    if (value.hasOwnProperty("_id")) {
      return this.listArticulos.filter(option =>
        option._id.toLowerCase().includes(value._id.toLocaleLowerCase())
      );
    }
    return this.listArticulos.filter(option =>
      option.denominacion.toLowerCase().includes(value.toLocaleLowerCase())
    );
  }

  addDetalleToList() {
    if (this.groupDetalle.valid) {
      const detalle = {
        cantidad: this.groupDetalle.controls.cantidadCtrl.value,
        articulo: this.groupDetalle.controls.artCtrl.value
      };
      this.detalleArticulos.push(detalle);
      this.groupDetalle.controls.cantidadCtrl.setValue(0);
      this.groupDetalle.controls.artCtrl.setValue("");
    }
  }

  checkValueAutocomplete() {
    return !this.groupDetalle.controls.artCtrl.value ? false : true;
  }

  displayFn(data) {
    if (!data) {
      return "";
    }
    const index = this.listArticulos.findIndex(a => a._id === data._id);
    return this.listArticulos[index].denominacion;
  }

  deleteDetalle(id: string) {
    this.detalleArticulos = this.detalleArticulos.filter(
      det => det.articulo._id !== id
    );
  }

  onSaveClick() {
    const oferta = {
      nombre: this.form.controls.nombre.value,
      precio: this.form.controls.precio.value,
      tiempoDeCoccion: this.form.controls.tiempoDeCoccion.value,
      detalle: this.detalleArticulos.map(d => {
        return { cantidad: d.cantidad, articulo: d.articulo };
      })
    };
    if (!this.artOfertaRef) {
      this.articuloService
        .addArticuloOferta(oferta)
        .toPromise()
        .then(() => {
          this.snackBar.openSnackBar("Articulo agregado satisfactoriamente");
          this.form.reset();
          this.detalleArticulos = [];
        })
        .catch(err => {
          console.log(err);
          this.snackBar.openSnackBar(
            "Falla al agregar articulo, intente nuevamente"
          );
        });
    } else {
      this.articuloService
        .updateArticuloOferta(
          this.artOfertaRef._id,
          oferta
        )
        .toPromise()
        .then(() => {
          this.snackBar.openSnackBar("Actualizado");
        });
    }
  }

  onNoClick() {
    this.detalleArticulos = [];
  }

  setValues() {
    if (this.artOfertaRef) {
      this.form.controls.nombre.setValue(this.artOfertaRef.nombre);
      this.form.controls.precio.setValue(this.artOfertaRef.precio);
      this.form.controls.tiempoDeCoccion.setValue(
        this.artOfertaRef.tiempoDeCoccion
      );
      this.detalleArticulos = this.artOfertaRef.detalle;
    }
  }
}

export function greaterThanZeroValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    const invalid = !control.value || Number(control.value) <= 0;
    return invalid ? { invalid: { value: control.value } } : null;
  };
}
