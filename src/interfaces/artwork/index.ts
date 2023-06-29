import { OrderInterface } from 'interfaces/order';
import { ReviewInterface } from 'interfaces/review';
import { VendorInterface } from 'interfaces/vendor';
import { GetQueryInterface } from 'interfaces';

export interface ArtworkInterface {
  id?: string;
  name: string;
  description: string;
  dimensions: string;
  materials: string;
  artist_background: string;
  price: number;
  vendor_id?: string;
  created_at?: any;
  updated_at?: any;
  order?: OrderInterface[];
  review?: ReviewInterface[];
  vendor?: VendorInterface;
  _count?: {
    order?: number;
    review?: number;
  };
}

export interface ArtworkGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  description?: string;
  dimensions?: string;
  materials?: string;
  artist_background?: string;
  vendor_id?: string;
}
