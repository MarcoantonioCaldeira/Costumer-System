import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order/order.service'; 
import { OrderResponseDto } from '../../dto/order-service.dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-edit',
  templateUrl: './order-edit.component.html',
  styleUrls: [],
  standalone:true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class OrderEditComponent implements OnInit {
  orderEditForm!: FormGroup; 
  orderId!: number;
  order: OrderResponseDto | undefined; 
  isLoading: boolean = true;
  errorMessage: string | null = null;

  statusOptions: string[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  constructor(
    public fb: FormBuilder,
    private route: ActivatedRoute, 
    public router: Router,
    private ordersService: OrderService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.orderId = +idParam;
        this.loadOrder();
      } else {
        this.errorMessage = 'Order ID not provided in URL.';
        this.isLoading = false;
      }
    });

    this.orderEditForm = this.fb.group({
      status: ['', Validators.required] 
    });
  }

  loadOrder(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.ordersService.getOrderById(this.orderId).subscribe({
      next: (order) => {
        this.order = order;
        this.orderEditForm.patchValue({
          status: order.status
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Unable to load order data. Check the console for details';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.orderEditForm.valid && this.orderId) {
      this.isLoading = true;
      this.errorMessage = null;
      const updatedData: { status: string } = {
        status: this.orderEditForm.get('status')?.value
      };

      this.ordersService.updateOrder(this.orderId, updatedData).subscribe({
        next: (updatedOrder) => {
          this.isLoading = false;
          this.router.navigate(['dashboard/orders']);
        },
        error: (err) => {
          this.errorMessage = 'Error updating order. Please try again.';
          this.isLoading = false;
          if (err.error && err.error.message) {
            this.errorMessage = `Erro: ${err.error.message}`;
          }
        }
      });
    } else {
      this.errorMessage = 'Invalid form. Please select a status.';
    }
  }
}