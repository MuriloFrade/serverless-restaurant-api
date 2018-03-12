
import { Restaurant, ListResponse, FilterQuery } from '../types/entities'

export interface IRestaurantService {
  create (restaurant: Restaurant): Promise<Restaurant>
  read (restaurantId: string): Promise<Restaurant>
  update (restaurantId: string, data: Map<string,any>): Promise<Restaurant>
  delete (restaurantId: string): Promise<void>
  list (cursor?: string): Promise<ListResponse>
}

export interface IDBConnector {
  createRestaurant (restaurant: Restaurant): Promise<Restaurant>
  getRestaurant (restaurantId: string): Promise<Restaurant>
  updateRestaurant (restaurantId: string, filter: FilterQuery, data: Map<string,any>): Promise<Restaurant>
  deleteRestaurant (restaurantId: string): Promise<void>
  getPaginatedRestaurant (cursor?: string): Promise<ListResponse>
}