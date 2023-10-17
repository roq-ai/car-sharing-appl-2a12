import { BookingInterface } from 'interfaces/booking';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface CarInterface {
  id?: string;
  model: string;
  manufacturer: string;
  year: number;
  color?: string;
  license_plate: string;
  user_id: string;
  created_at?: any;
  updated_at?: any;
  booking?: BookingInterface[];
  user?: UserInterface;
  _count?: {
    booking?: number;
  };
}

export interface CarGetQueryInterface extends GetQueryInterface {
  id?: string;
  model?: string;
  manufacturer?: string;
  color?: string;
  license_plate?: string;
  user_id?: string;
}
