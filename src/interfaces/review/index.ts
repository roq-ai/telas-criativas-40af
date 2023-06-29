import { UserInterface } from 'interfaces/user';
import { ArtworkInterface } from 'interfaces/artwork';
import { GetQueryInterface } from 'interfaces';

export interface ReviewInterface {
  id?: string;
  rating: number;
  comment: string;
  user_id?: string;
  artwork_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  artwork?: ArtworkInterface;
  _count?: {};
}

export interface ReviewGetQueryInterface extends GetQueryInterface {
  id?: string;
  comment?: string;
  user_id?: string;
  artwork_id?: string;
}
