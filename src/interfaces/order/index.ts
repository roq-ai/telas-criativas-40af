import { UserInterface } from 'interfaces/user';
import { ArtworkInterface } from 'interfaces/artwork';
import { GetQueryInterface } from 'interfaces';

export interface OrderInterface {
  id?: string;
  user_id?: string;
  artwork_id?: string;
  status: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  artwork?: ArtworkInterface;
  _count?: {};
}

export interface OrderGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  artwork_id?: string;
  status?: string;
}
