import { Injectable } from "@angular/core";
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router} from "@angular/router";
import { Observable } from "rxjs";
import { map, take, tap } from "rxjs/operators";

import { AuthService } from "../../../Shared/services/auth/auth.service";
import { SnackBarService } from "../../../Shared/services/snack-bar/snack-bar.service";

@Injectable({
  providedIn: "root"
})
export class AuthGuardService implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    private snackBarService: SnackBarService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.auth.afAuth.user.pipe(
      take(1),
      map(user => !!user),
      tap(loggedIn => {
        if (!loggedIn) {
          console.log("Acceso Denegado");
          this.navigateToLogin(state.url);
        }
      })
    );
  }

  navigateToLogin(url: string) {
    const res = url.split("/").filter(x => x !== "");
    this.snackBarService.openSnackBar("¡Debe loguearse para acceder!");
    if (res[0] === "admin") {
      this.router.navigate(["/login"]);
      return;
    } else if (res[0] === "recepcion") {
      this.router.navigate(["/login"]);
      return;
    } else {
      this.router.navigate(["/client-login"]);
    }
  }
}
