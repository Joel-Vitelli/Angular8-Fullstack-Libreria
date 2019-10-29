import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { AuthService } from "../../../Shared/services/auth/auth.service";
import { Cliente } from "../../../Admin/interfaces/cliente";
import { ClienteService } from "../../../Admin/services/cliente/cliente.service";
import { SnackBarService } from "../../../Shared/services/snack-bar/snack-bar.service";

@Component({
  selector: "app-cliente",
  templateUrl: "./cliente.component.html",
  styleUrls: ["./cliente.component.scss"]
})
export class ClienteComponent implements OnInit {
  @Input() cliente: Cliente = null;

  clientFormGroup: FormGroup;
  opened = false;
  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit() {
    this.clientFormGroup = this.fb.group({
      nombreControl: ["", [Validators.required, Validators.maxLength(20)]],
      apellidoControl: ["", [Validators.required, Validators.maxLength(20)]],
      telefonoControl: [
        0,
        [
          Validators.required,
          Validators.min(0),
          Validators.maxLength(12),
          Validators.minLength(6)
        ]
      ],
      calleControl: ["", [Validators.maxLength(60)]],
      numeroControl: ["", [Validators.maxLength(30)]],
      localidadControl: ["", [Validators.maxLength(30)]]
    });
    this.setDataToForm();
  }

  onSaveClick() {
    const newCliente = {
      nombre: this.clientFormGroup.controls.nombreControl.value,
      apellido: this.clientFormGroup.controls.apellidoControl.value,
      telefono: this.clientFormGroup.controls.telefonoControl.value,
      domicilio: {
        calle: this.clientFormGroup.controls.calleControl.value,
        numero: this.clientFormGroup.controls.numeroControl.value,
        localidad: this.clientFormGroup.controls.localidadControl.value
      }
    };
    this.clienteService
      .updateCliente(this.cliente._id, newCliente)
      .toPromise()
      .then(() => {
        this.snackBarService.openSnackBar("Datos guardados correctamente");
      })
      .catch(() => {
        this.snackBarService.openSnackBar(
          "Error al guardar datos, reintente mas tarde"
        );
      });
  }

  setDataToForm() {
    if (!this.cliente) {
      return;
    }
    this.clientFormGroup.controls.nombreControl.setValue(this.cliente.nombre);
    this.clientFormGroup.controls.apellidoControl.setValue(
      this.cliente.apellido
    );
    this.clientFormGroup.controls.telefonoControl.setValue(
      this.cliente.telefono
    );
    this.clientFormGroup.controls.calleControl.setValue(
      this.cliente.domicilio.calle || ""
    );
    this.clientFormGroup.controls.numeroControl.setValue(
      this.cliente.domicilio.numero || ""
    );
    this.clientFormGroup.controls.localidadControl.setValue(
      this.cliente.domicilio.localidad || ""
    );
  }
}
