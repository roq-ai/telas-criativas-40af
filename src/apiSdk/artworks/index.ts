import axios from 'axios';
import queryString from 'query-string';
import { ArtworkInterface, ArtworkGetQueryInterface } from 'interfaces/artwork';
import { GetQueryInterface } from '../../interfaces';

export const getArtworks = async (query?: ArtworkGetQueryInterface) => {
  const response = await axios.get(`/api/artworks${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createArtwork = async (artwork: ArtworkInterface) => {
  const response = await axios.post('/api/artworks', artwork);
  return response.data;
};

export const updateArtworkById = async (id: string, artwork: ArtworkInterface) => {
  const response = await axios.put(`/api/artworks/${id}`, artwork);
  return response.data;
};

export const getArtworkById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/artworks/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteArtworkById = async (id: string) => {
  const response = await axios.delete(`/api/artworks/${id}`);
  return response.data;
};
