// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { OrderCreateComponent } from './components/order-create/order-create.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { OrderEditComponent } from './components/order-edit/order-edit.component';
import { AuthGuard } from './guards/auth.guard'; 

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login - Sistema de Pedidos'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    title: 'Main Panel',
    children: [
      {
        path: 'create-order',
        component: OrderCreateComponent,
        title: 'New Order'
      },
      {
        path: 'orders',
        component: OrderListComponent,
        title: 'My Orders'
      },
      {
        path: 'edit-order/:id',
        component: OrderEditComponent,
        title: 'Edit Order'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**', // Wildcard route for any unmatched path
    redirectTo: 'login'
  }
];