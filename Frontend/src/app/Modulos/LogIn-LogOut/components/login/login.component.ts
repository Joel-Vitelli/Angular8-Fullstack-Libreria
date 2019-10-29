import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { User } from "firebase";
import { AuthService } from "../../../Shared/services/auth/auth.service";
import { UsersService } from "../../../Admin/services/users/users.service";
import { SnackBarService } from "../../../Shared/services/snack-bar/snack-bar.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  emailFormGroup: FormGroup;
  passwordFormGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private userService: UsersService,
    private snackBar: SnackBarService
  ) { }

  ngOnInit() {
    this.emailFormGroup = this.formBuilder.group({
      emailControl: ["", [Validators.required, Validators.email]]
    });
    this.passwordFormGroup = this.formBuilder.group({
      passwordControl: ["", [Validators.minLength(6)]]
    });
  }

  login() {
    console.log(this.emailFormGroup.value.emailControl);
    this.auth
      .emailLogin(
        this.emailFormGroup.value.emailControl,
        this.passwordFormGroup.value.passwordControl
      )
      .then((u: User) => {
        this.userService
          .getPermissionsByUser(u.email)
          .then(array => {
            if (!array || array.length === 0) {
              this.snackBar.openSnackBar(
                "Necesita permisos de administrador"
              );
              this.router.navigate(["/"]);
            } else {
              if (array.length === 1) {
                this.router.navigate(["/admin"]);
              } else {
                this.router.navigate(["/globalHome"]);
              }
            }
          })
          .catch(() => {
            console.log("Error");
            this.router.navigate(["/"]);
          });
      });
  }
}
