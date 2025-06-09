import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { OrderService } from '../../services/order/order.service';
import { ProductService } from '../../services/products/product.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-order-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './order-create.component.html',
  styleUrls: []
})
export class OrderCreateComponent implements OnInit {
  orderForm: FormGroup;
  products: Product[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private productService: ProductService,
    private router: Router
  ) {
    this.orderForm = this.fb.group({
      items: this.fb.array([this.createItem()])
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load products';
        this.isLoading = false;
      }
    });
  }

  get items(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  createItem() {
    return this.fb.group({
      productId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  addItem() {
    this.items.push(this.createItem());
  }

  removeItem(index: number) {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  onSubmit() {
    if (this.orderForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const orderData = {
        items: this.orderForm.value.items.map((item: any) => ({
          productId: Number(item.productId),
          quantity: Number(item.quantity)
        }))
      };

      this.orderService.createOrder(orderData).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/dashboard/orders']);
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = err.error?.message || 'Failed to create order';
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = 'Please fill all required fields correctly';
      this.markFormGroupTouched(this.orderForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}