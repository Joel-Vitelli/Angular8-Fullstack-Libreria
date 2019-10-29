import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from "./Modulos/Client/components/home/home.component";
import { AdminComponent } from "./Modulos/Admin/components/admin/admin.component";
import { LoginComponent } from "./Modulos/LogIn-LogOut/components/login/login.component";
import { AuthGuardService } from "./Modulos/Admin/services/guards/auth-guard.service";
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
import { LogInComponent } from "./Modulos/LogIn-LogOut/components/log-in/log-in.component";


const routes: Routes = [
  {
    path: "",
    component: LogInComponent
  },
  {
    path: "globalHome",
    component: HomeComponent
  },
  {
    path: "admin",
    component: AdminComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: "",
        component: RecepcionComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "articulo",
        component: ArticuloComponent
      },
      {
        path: "rubro",
        component: RubroArticuloComponent
      },
      {
        path: "oferta",
        component: ArticuloOfertaComponent
      },
      {
        path: "horario",
        component: HorarioComponent
      },
      {
        path: "pedidosxfacturar",
        component: PedidosSinFacturaComponent
      },
      {
        path: "facturas",
        component: FacturasComponent
      },
      {
        path: "totalsales",
        component: ArticuloCounterComponent
      },
      {
        path: "pedidos",
        component: PedidosComponent
      },
      {
        path: "clientes",
        component: ClientesComponent
      },
      {
        path: "users",
        component: ListUserComponent
      },
      {
        path: "recepcion",
        component: RecepcionComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: "home",
        component: HomeComponent
      }
    ]
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "client-login",
    component: CommonLoginComponent
  },
  {
    path: "account",
    component: AccountComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "logInGlobal",
    component: LogInComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
