import { Component, OnInit, Input } from "@angular/core";
import { FormControl, FormBuilder, FormGroup, Validators} from "@angular/forms";

import { UsersService } from "../../services/users/users.service";
import { SnackBarService } from "../../../Shared/services/snack-bar/snack-bar.service";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"]
})
export class UsersComponent implements OnInit {
  @Input() user: any = null;

  checkedAdmin = false;
  checkedRecepcion = false;
  form: FormGroup;
  email: FormControl = new FormControl("", [
    Validators.required,
    Validators.email
  ]);
  name: FormControl = new FormControl("", [
    Validators.maxLength(50),
    Validators.required
  ]);
  permission: string[] = [];
  id: string = "";
  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit() {
    if (this.user) {
      this.email.setValue(this.user.email);
      this.name.setValue(this.user.name);
      this.permission = this.user.roles;
      this.id = this.user._id;
    }

    this.form = this.fb.group({
      email: this.email,
      name: this.name
    });
    this.getPermisions();
  }

  async onSaveClick() {
    const arrayRoles = [];
    if (this.checkedAdmin) {
      await arrayRoles.push("admin");
    }
    if (this.checkedRecepcion) {
      await arrayRoles.push("recepcion");
    }
    const user = {
      email: this.form.controls.email.value,
      name: this.form.controls.name.value,
      roles: arrayRoles
    };
    if (this.id.length === 0) {
      this.addUser(user);
      return;
    } else {
      this.editUser(user);
      return;
    }
  }

  getPermisions() {
    if (this.permission.length > 0) {
      this.checkedAdmin = this.permission.includes("admin");
      this.checkedRecepcion = this.permission.includes("recepcion");
    }
  }

  addUser(user: any) {
    this.usersService
      .addUser(user)
      .toPromise()
      .then(() => {
        this.snackBarService.openSnackBar("Se agrego el nuevo usuario");
      })
      .catch(() => {
        this.snackBarService.openSnackBar(
          "Hubo un error, intentelo nuevamente"
        );
      });
  }

  editUser(user: any) {
    this.usersService
      .editUser(this.id, user)
      .toPromise()
      .then(() => {
        this.snackBarService.openSnackBar("Editado");
      })
      .catch(() => {
        this.snackBarService.openSnackBar(
          "Hubo un error, intentelo nuevamente."
        );
      });
  }

  onDeleteClick() {
    this.usersService
      .deleteUser(this.id)
      .toPromise()
      .then(() => {
        this.snackBarService.openSnackBar("Eliminado!");
        this.form.reset();
        this.checkedAdmin = this.checkedRecepcion = false;
      })
      .catch(() => {
        this.snackBarService.openSnackBar(
          "Hubo un error, intentelo nuevamente."
        );
      });
  }
}
