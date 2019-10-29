import { MAT_DATE_LOCALE } from "@angular/material";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule, LOCALE_ID } from "@angular/core";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AngularFireModule } from "@angular/fire";
import { MaterialModule } from "./material.module";
import { AngularFireAuthModule } from "angularfire2/auth";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { environment } from "../environments/environment";

import { HomeComponent } from "./Modulos/Client/components/home/home.component";
import { AdminComponent } from "./Modulos/Admin/components/admin/admin.component";
import { LoginComponent } from "./Modulos/LogIn-LogOut/components/login/login.component";
import { RecepcionComponent } from "./Modulos/Admin/components/recepcion/recepcion.component";
import { ArticuloComponent } from "./Modulos/Admin/components/articulo/articulo.component";
import { RubroArticuloComponent } from "./Modulos/Admin/components/rubro-articulo/rubro-articulo.component";
import { ArticuloOfertaComponent } from "./Modulos/Admin/components/oferta/articulo-oferta.component";
import { HorarioComponent } from "./Modulos/Admin/components/horario/horario.component";
import { CommonLoginComponent } from "./Modulos/LogIn-LogOut/components/common-login/common-login.component";
import { AccountComponent } from "./Modulos/Client/components/account/account.component";
import { PedidosSinFacturaComponent } from "./Modulos/Admin/components/pedidos/pedidos-sin-factura/pedidos-sin-factura.component";
import { FacturasComponent } from "./Modulos/Admin/components/facturas/facturas.component";
import { ArticuloCounterComponent } from "./Modulos/Admin/components/articulo-counter/articulo-counter.component";
import { PedidosComponent } from "./Modulos/Admin/components/pedidos/pedidos.component";
import { ClientesComponent } from "./Modulos/Admin/components/clientes/clientes.component";
import { ListUserComponent } from "./Modulos/Admin/components/users/list/list-user.component";
import { NavbaradminComponent } from "./Modulos/Admin/components/navbaradmin/navbaradmin.component";
import { AuthService } from "./Modulos/Shared/services/auth/auth.service";
import { ArticuloDialogComponent} from "./Modulos/Admin/components/articulo/articulo.component";
import { SnackBarComponent } from "./Modulos/Shared/components/snack-bar/snack-bar.component";
import { ConfirmDialogComponent } from "./Modulos/Shared/components/confirm-dialog/confirm-dialog.component";
// tslint:disable-next-line: max-line-length
import { EditOfertaComponent } from "./Modulos/Admin/components/oferta/edit-oferta/edit-oferta.component";
import { HorarioDialogComponent} from "./Modulos/Admin/components/horario/horario.component";
import { ClienteComponent } from "./Modulos/Client/components/cliente/cliente.component";
import { NavbarHomeComponent } from "./Modulos/Client/components/navbar-home/navbar-home.component";
import { AmountDialogComponent } from "./Modulos/Client/components/home/amount-dialog/amount-dialog.component";
import { HourDialogComponent } from "./Modulos/Client/components/home/hour-dialog/hour-dialog.component";
import { UsersComponent } from "./Modulos/Admin/components/users/users.component";
import { ParticlesComponent } from "./Modulos/Particles/particles/particles.component";
import { ParticlesModule } from 'angular-particle';
import { LogInComponent } from "./Modulos/LogIn-LogOut/components/log-in/log-in.component";



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbaradminComponent,
    LoginComponent,
    AdminComponent,
    RecepcionComponent,
    ArticuloComponent,
    ArticuloDialogComponent,
    RubroArticuloComponent,
    SnackBarComponent,
    ConfirmDialogComponent,
    ArticuloOfertaComponent,
    EditOfertaComponent,
    HorarioComponent,
    HorarioDialogComponent,
    CommonLoginComponent,
    ClienteComponent,
    NavbarHomeComponent,
    AmountDialogComponent,
    HourDialogComponent,
    AccountComponent,
    PedidosSinFacturaComponent,
    FacturasComponent,
    ArticuloCounterComponent,
    PedidosComponent,
    ClientesComponent,
    UsersComponent,
    ListUserComponent,
    ParticlesComponent,
    LogInComponent,
  ],
  entryComponents: [
    ArticuloDialogComponent,
    SnackBarComponent,
    ConfirmDialogComponent,
    HorarioDialogComponent,
    CommonLoginComponent,
    AmountDialogComponent,
    HourDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    ParticlesModule
  ],
  providers: [AuthService, { provide: MAT_DATE_LOCALE, useValue: "es" }],
  bootstrap: [AppComponent]
})
export class AppModule {}
