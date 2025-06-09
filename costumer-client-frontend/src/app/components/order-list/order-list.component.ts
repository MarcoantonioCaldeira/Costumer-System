import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order/order.service';
import { HttpErrorResponse } from '@angular/common/http'; 

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl:'./order-list.component.html'
})
export class OrderListComponent {
  orders: any[] = [];
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orderService.getOrders().subscribe({
      next: (orders) => this.orders = orders,
      error: (err) => console.error('Error loading orders', err)
    });
  }

  deleteOrder(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.orderService.removeOrder(id).subscribe({
      next: () => {
        this.orders = this.orders.filter(order => order.id !== id);
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.error?.message || `Falha ao deletar o pedido.`;
        this.isLoading = false;
      }
    });
  }
}
