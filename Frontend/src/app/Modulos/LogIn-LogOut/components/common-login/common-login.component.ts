import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

import { AuthService } from "../../../Shared/services/auth/auth.service";
import { SnackBarService } from "../../../Shared/services/snack-bar/snack-bar.service";
import { ClienteService } from "../../../Admin/services/cliente/cliente.service";
import { Cliente } from "../../../Admin/interfaces/cliente";
import { Router } from '@angular/router';


@Component({
  selector: "app-common-login",
  templateUrl: "./common-login.component.html",
  styleUrls: ["./common-login.component.scss"]
})
export class CommonLoginComponent implements OnInit {
  emailFormGroup: FormGroup;
  passwordFormGroup: FormGroup;
  clientFormGroup: FormGroup;
  isLogin = true;

  constructor(
    private authService: AuthService,
    private snackBarService: SnackBarService,
    private clienteService: ClienteService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CommonLoginComponent>,
    private router: Router,
    private auth: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.emailFormGroup = this.fb.group({
      emailControl: ["", [Validators.required, Validators.email]]
    });
    this.passwordFormGroup = this.fb.group({
      passwordControl: ["", [Validators.minLength(6), Validators.required]]
    });
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
  }

  selectAction(value: any) {
    this.isLogin = value === "signIn" ? true : false;
  }

  regresar(): void {
    this.dialogRef.close({ type: "signUp" });
  }

  login() {
    this.authService
      .emailLogin(
        this.emailFormGroup.controls.emailControl.value,
        this.passwordFormGroup.controls.passwordControl.value
      )
      .then(u => {
        if (u) {
          this.snackBarService.openSnackBar(
            "Bienvenido/a  " + u.displayName
          );
          this.router.navigate(["globalHome"]);
          this.dialogRef.close({ type: "signIn" });
        }
      });
  }

  singUp() {
    this.authService
      .emailSignUp(
        this.emailFormGroup.controls.emailControl.value,
        this.passwordFormGroup.controls.passwordControl.value,
        this.clientFormGroup.controls.nombreControl.value
      )
      .then(data => {
        if (data) {
          this.addCliente();
          this.dialogRef.close({ type: "signUp" });
        }
      });
  }

  addCliente() {
    const cliente: Cliente = {
      nombre: this.clientFormGroup.controls.nombreControl.value,
      apellido: this.clientFormGroup.controls.apellidoControl.value,
      email: this.emailFormGroup.controls.emailControl.value,
      telefono: this.clientFormGroup.controls.telefonoControl.value,
      creacion: new Date(Date.now()),
      domicilio: {
        calle: this.clientFormGroup.controls.calleControl.value || "",
        numero: this.clientFormGroup.controls.numeroControl.value || "",
        localidad: this.clientFormGroup.controls.localidadControl.value || ""
      }
    };
    return this.clienteService
      .addCliente(cliente)
      .toPromise()
      .then(c => {
        console.log(c);
      })
      .catch(() => {
        this.snackBarService.openSnackBar(
          "Hubo un error al crear el perfil. Por favor, actualize sus datos"
        );
      });
  }
}
