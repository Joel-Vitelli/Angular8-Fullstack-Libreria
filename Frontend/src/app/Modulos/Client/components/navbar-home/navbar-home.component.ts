import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";

import { CommonLoginComponent } from "../../../LogIn-LogOut/components/common-login/common-login.component";
import { AuthService } from "../../../Shared/services/auth/auth.service";
import { User } from "../../../Admin/interfaces/user";
import { ClienteService } from "../../../Admin/services/cliente/cliente.service";

@Component({
  selector: "app-navbar-home",
  templateUrl: "./navbar-home.component.html",
  styleUrls: ["./navbar-home.component.scss"]
})
export class NavbarHomeComponent implements OnInit {
  user: User = null;
  constructor(
    public dialog: MatDialog,
    private auth: AuthService,
    private clienteService: ClienteService
  ) {}

  ngOnInit() {
    this.auth.user.subscribe(u => {
      this.user = u ? u : null;
    });
  }

  logIn() {
    const dialogRef = this.dialog.open(CommonLoginComponent, {
      width: "450%"
    });
    dialogRef.afterClosed().subscribe(data => {
      console.log(data); });
  }

  logOut() {
    this.auth.signOut();
  }
}
