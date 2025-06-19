import { Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration';
import { Login } from './login/login';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { authGuard } from './guards/auth.guard';
import { redirectGuard } from './guards/redirect.guard';

export const routes: Routes = [
  { path: '', canActivate: [redirectGuard], children: [] },
  { path: 'register', component: RegistrationComponent },
  { path: 'login', component: Login },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'product/:id', component: ProductDetailsComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/' }
]; 