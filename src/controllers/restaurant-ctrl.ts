
import { inject, injectable } from 'inversify'
import { Request, Response } from 'express'
import { interfaces, controller, httpGet, httpPost, httpDelete, httpPut, request, queryParam, response, requestParam } from 'inversify-express-utils'

import { IRestaurantService } from '../types/interfaces'
import { TYPES } from '../inversify.config'
import {
  respondWithCreated,
  respondWithError,
  respondWithItem,
  respondDeleted,
  respondWithPagination } from './utils'

@controller('/restaurants')
export class RestaurantCtrl implements interfaces.Controller {

  constructor (
    @inject(TYPES.IRestaurantService) private restaurantService: IRestaurantService
  ) { }

  @httpGet('/')
  public list (req: Request, res: Response): Promise<any> {
    return this.restaurantService.list()
      .then(data => respondWithPagination(data, res))
      .catch(error => respondWithError(error, res))
  }

  @httpPost("/")
  create (req: Request, res: Response): Promise<any> {
    return this.restaurantService.create(req.body)
      .then(restaurant => respondWithCreated(restaurant, res))
      .catch(error => respondWithError(error, res))
  }

  @httpGet("/:restaurantId")
  private read(req: Request, res: Response): Promise<any> {
    return this.restaurantService.read(req.params.restaurantId)
      .then(restaurant => respondWithItem(restaurant, res))
      .catch(error => respondWithError(error, res))
  }

  @httpPut('/:restaurantId')
  public updateUser(req: Request, res: Response): Promise<any> {
    return this.restaurantService.update(req.params.restaurantId, req.body)
      .then(restaurant => respondWithItem(restaurant, res))
      .catch(error => respondWithError(error, res))
  }

  @httpDelete('/:restaurantId')
  public deleteUser(req: Request, res: Response): Promise<any> {
    return this.restaurantService.delete(req.params.restaurantId)
      .then(() => respondDeleted({}, res))
      .catch(error => respondWithError(error, res))
  }
}
