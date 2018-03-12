
import { Container } from 'inversify'
import {
  IRestaurantService,
  IDBConnector
} from './types/interfaces'

const TYPES = {
  IRestaurantService: Symbol.for("IRestaurantService"),
  IDBConnector: Symbol.for("IDBConnector")
}

import { DynamoDBConnector } from './dynamodb/dbconnector'
import { RestaurantService } from './services/restaurant-service'


const container = new Container()
container.bind<IDBConnector>(TYPES.IDBConnector).to(DynamoDBConnector)
container.bind<IRestaurantService>(TYPES.IRestaurantService).to(RestaurantService)
export { TYPES, container }