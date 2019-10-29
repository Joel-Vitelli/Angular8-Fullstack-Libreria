import { Component, OnInit } from "@angular/core";
import { AuthService } from "./Modulos/Shared/services/auth/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  title = "libreria";

  constructor(public auth: AuthService) {}

  ngOnInit() {}
}
