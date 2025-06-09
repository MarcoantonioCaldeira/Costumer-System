import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { OrderResponseDto } from '../../dto/order-response.dto'

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/orders'; 

  constructor(private http: HttpClient) {}

  createOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, orderData);
  }

  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/list`);
  }

  getOrderById(id: number):Observable<OrderResponseDto> { 
    return this.http.get<OrderResponseDto>(`${this.apiUrl}/${id}`);
  }

  updateOrder(id: number, orderData: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, orderData);
  }

  removeOrder(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}