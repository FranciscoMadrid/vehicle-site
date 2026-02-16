export interface Vehicle {
  id?: number;
  plate: string;
  brand?: string,
  model?: string,
  fk_brand_id?: number,
  fk_model_id: number;
  created_at?: string;
}

export interface Model {
  id?: number,
  model: string,
  fk_brand_id: number
}

export interface Log {
  id?: number;
  fk_vehicle_id: number,
  type: 'ENTRY' | 'EXIT',
  driver_name: string,
  mileage: string,
  createdAt?: string;
}

export interface Brand {
  id?: number,
  brand: string
}