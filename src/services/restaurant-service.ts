
import { injectable, inject } from "inversify"

import { TYPES } from '../inversify.config'
import { Restaurant, ListResponse } from '../types/entities'
import { IRestaurantService, IDBConnector } from '../types/interfaces'

@injectable()
export class RestaurantService implements IRestaurantService {
  constructor (
    @inject(TYPES.IDBConnector) private db: IDBConnector
  ) {

  }

  create (restaurant: Restaurant): Promise<Restaurant> {
    return new Promise(async (resolve, reject) => {
      if (!restaurant.name) {
        return reject(Error('Name is required'))
      }
      const dbErrorMsg = 'Could not create restaurant'
      this.db.createRestaurant(restaurant)
        .then(data => resolve(restaurant))
        .catch(e => reject(dbErrorMsg))
    })
  }

  read (restaurantId: string): Promise<Restaurant> {
    return new Promise(async (resolve, reject) => {
      if (!restaurantId) {
        return reject(Error('restaurantId is required'))
      }
      const dbErrorMsg = 'Could not read restaurant'
      this.db.getRestaurant(restaurantId)
        .then(data => resolve(data))
        .catch(e => reject(dbErrorMsg))
    })
  }

  update (restaurantId: string, data: Map<string, any>): Promise<Restaurant> {
    return new Promise((resolve, reject) => {
      if (!restaurantId) {
        return reject(Error('restaurantId is required'))
      }
      console.log('Updating restaurant', restaurantId, data)
      const dbErrorMsg = 'Could not update restaurant'
      this.db.updateRestaurant(restaurantId, {}, data)
      .then(data => resolve(data))
      .catch(e => reject(dbErrorMsg))
    })
  }

  delete (restaurantId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!restaurantId) {
        return reject(Error('restaurantId is required'))
      }
      console.log('Deleting restaurant', restaurantId)
      const dbErrorMsg = 'Could not delete restaurant'
      this.db.deleteRestaurant( restaurantId)
      .then(resolve)
      .catch(e => reject(dbErrorMsg))
    })
  }

  list(cursor?: string): Promise<ListResponse> {
    return new Promise(async (resolve, reject) => {
      const dbErrorMsg = 'Could not list restaurants'
      this.db.getPaginatedRestaurant(cursor)
      .then(resolve)
      .catch(e => reject(dbErrorMsg))
    })
  }

}