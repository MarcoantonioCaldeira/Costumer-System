export interface OrderResponseDto {
  id: number;
  userId: number;
  status: string;
  calculatedTotalPrice: number;
}