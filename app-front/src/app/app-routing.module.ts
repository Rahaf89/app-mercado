import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { DoorComponent } from './door/door.component';

const routes: Routes = [
  { path: '', component: DoorComponent, pathMatch: 'full' },
  { path: "login", component: LoginComponent, pathMatch: "full" },
  { path: "forgotPassword", component: ForgotPasswordComponent, pathMatch: "full" },
  { path: "register", component: RegisterComponent, pathMatch: "full" },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})

export class AppRoutingModule { }
