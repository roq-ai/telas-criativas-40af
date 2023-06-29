const mapping: Record<string, string> = {
  artworks: 'artwork',
  orders: 'order',
  reviews: 'review',
  users: 'user',
  vendors: 'vendor',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
