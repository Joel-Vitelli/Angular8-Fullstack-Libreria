import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { auth, User } from "firebase";
import { AngularFireAuth } from "angularfire2/auth";
import { Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";
import { SnackBarService } from "../../../Shared/services/snack-bar/snack-bar.service";

@Injectable()
export class AuthService {
  user: Observable<User | null>;
  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private snackBarService: SnackBarService
  ) {
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return of(user);
        } else {
          return of(null);
        }
      })
    );
  }

  // Registro con email y contraseña
  emailSignUp(email: string, password: string, name: string) {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(credential => {
        this.snackBarService.openSnackBar("Bienvenido a la Libreria");
        return credential.user.updateProfile({ displayName: name }).then(() => {
          console.log(credential);
          return credential.user as User;
        });
      })
      .catch(error => {
        this.handleError(error, error.code);
      });
  }

  // Login con email y pass
  emailLogin(email: string, password: string) {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(credential => {
        return credential.user as User;
      })
      .catch(error => {
        this.handleError(error, error.code);
      });
  }

  googleLogin() {
    const provider = new auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  githubLogin() {
    const provider = new auth.GithubAuthProvider();
    return this.oAuthLogin(provider);
  }

  facebookLogin() {
    const provider = new auth.FacebookAuthProvider();
    return this.oAuthLogin(provider);
  }

  twitterLogin() {
    const provider = new auth.TwitterAuthProvider();
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider: any) {
    return this.afAuth.auth
      .signInWithPopup(provider)
      .then(credential => {
        console.log("Bienvenido : " + credential);
      })
      .catch(error => this.handleError(error));
  }

  signOut() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(["/"]);
    });
  }

  // Manejo de errores
  private handleError(error: Error, code: string = "") {
    if (code === "auth/wrong-password") {
      this.snackBarService.openSnackBar("Contraseña incorrecta");
      return;
    }
    if (code === "auth/user-not-found") {
      this.snackBarService.openSnackBar("Usuario no encontrado!");
      console.log("Usuario no encontrado!");
      return;
    }
    if (code === "400") {
      this.snackBarService.openSnackBar(
        "Alguno de los datos es incorrecto. Reviselos!"
      );
      return;
    }
    this.snackBarService.openSnackBar("Se produjo un error :(!");
    return;
  }

  // Enviar email para recuperar contraseña
  resetPassword(email: string) {
    const fbAuth = auth();
    return fbAuth
      .sendPasswordResetEmail(email)
      .then(() => {
        this.snackBarService.openSnackBar("Se envió el mail de recuperacion.");
      })
      .catch(error => this.handleError(error, error.code));
  }
}
