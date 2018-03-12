
import { injectable } from "inversify"
import { DynamoDB } from 'aws-sdk'
import *  as uuid from 'uuid/v1'

import { Restaurant, ListResponse, FilterQuery } from '../types/entities'
import { IDBConnector } from '../types/interfaces'

const RESTAURANTS_TABLE = process.env.RESTAURANTS_TABLE
const tables = {
  RESTAURANTS_TABLE: { name: process.env.RESTAURANTS_TABLE, key: 'restaurantId' }
}

const IS_OFFLINE = process.env.IS_OFFLINE === 'true'
const PAGINATION_SIZE = 50

type Key =  { [key: string]: any }
type DataQuery = { [key: string]: any }

@injectable()
export class DynamoDBConnector implements IDBConnector {

  private db: DynamoDB.DocumentClient

  constructor () {
    if (IS_OFFLINE) {
      process.env.AWS_ACCESS_KEY_ID = 'AWS_ACCESS_KEY_ID'
      process.env.AWS_SECRET_ACCESS_KEY = 'AWS_SECRET_ACCESS_KEY'
      this.db = new DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    } else {
      this.db = new DynamoDB.DocumentClient()
    }
  }

  createRestaurant(restaurant: Restaurant): Promise<Restaurant> {
    return this.sendCreate(tables.RESTAURANTS_TABLE.name, tables.RESTAURANTS_TABLE.key, restaurant)
  }

  getRestaurant(restaurantId: string): Promise<Restaurant> {
    return this.sendGet(tables.RESTAURANTS_TABLE.name, tables.RESTAURANTS_TABLE.key, restaurantId)
  }

  updateRestaurant(restaurantId: string, filter: FilterQuery, data: Map<string, any>): Promise<Restaurant> {
    return this.sendUpdate(tables.RESTAURANTS_TABLE.name, tables.RESTAURANTS_TABLE.key, restaurantId, {}, data)
  }
  deleteRestaurant(restaurantId: string): Promise<void> {
    return this.sendDelete(tables.RESTAURANTS_TABLE.name, tables.RESTAURANTS_TABLE.key, restaurantId)
  }
  getPaginatedRestaurant(cursor?: string): Promise<ListResponse> {
    return this.sendPaginatedScan(tables.RESTAURANTS_TABLE.name, tables.RESTAURANTS_TABLE.key, cursor)
  }

  private sendGet (tableName: string, keyName: string, keyValue: string): Promise<any> {
    const key = {} as Key
    key[keyName] = keyValue
    return new Promise((resolve, reject) => {
      this.db.get({
        TableName: tableName,
        Key: key,
        ConsistentRead:  false
      }, (error, data) => {
        if (error) {
          console.error(error)
          return reject(error)
        }
        resolve(data.Item as Restaurant)
      })
    })
  }

  private sendDelete (tableName: string, keyName: string, keyValue: string): Promise<any> {
    const key = {} as Key
    key[keyName] = keyValue
    return new Promise((resolve, reject) => {
      this.db.update({
        TableName: tableName,
        Key: key
      }, (error, data) => {
          if (error) {
            console.error(error)
            return reject(error)
          }
          resolve(data)
        })
      })
  }

  private sendCreate (tableName: string, keyName: string, data: DataQuery): Promise<any> {
    return new Promise((resolve, reject) => {
      data[keyName] = uuid()
      data.created = Date.now()
      this.db.put({
        TableName: tableName,
        Item: data
      }, (error, data) => {
        if (error) {
          console.error(error)
          return reject(error)
        }
        resolve(data)
      })
    })
  }

  private sendUpdate (tableName: string, keyName: string, keyValue: string, filter: FilterQuery, data: DataQuery): Promise<any> {
    return new Promise((resolve, reject) => {
      const key = {} as Key
      key[keyName] = keyValue
      const query = this.updateQuery(key, data)
      this.db.update({
        TableName: tableName,
        Key: key,
        ReturnValues: "ALL_NEW",
        ConditionExpression: query.conditionExpression,
        UpdateExpression: query.updateExpression,
        ExpressionAttributeNames: query.expressionAttributeNames,
        ExpressionAttributeValues: query.expressionAttributeValues
      }, (error, dataOutput) => {
        if (error) {
          console.error(error)
          return reject(error)
        }
        resolve(dataOutput.Attributes)
      })
    })
  }

  private sendPaginatedScan (tableName: string, keyName: string, cursor?: string): Promise<ListResponse> {
    return new Promise((resolve, reject) => {
      const params = {
        TableName: tableName,
        ConsistentRead:  false,
        Limit: PAGINATION_SIZE
      }
      if (cursor) {
        params['ExclusiveStartKey'][keyName] = cursor
      }
      this.db.scan(params, (error, data) => {
        if (error) {
          console.error(error)
          return reject(error)
        }
        resolve({
          items: data.Items as Restaurant [],
          cursor: data.LastEvaluatedKey ? data.LastEvaluatedKey[keyName] : null
        })
      })
    })
  }

  private updateQuery (filter: FilterQuery, data: DataQuery) {
    delete data.restaurantId
    data.updated = Date.now()

    const allProperties = { ...filter, ...data }
    const expressionAttributeNames = {}
    const expressionAttributeValues = {}
    for (const key in allProperties) {
      expressionAttributeNames['#' + key] = key
      expressionAttributeValues[':' + key] = allProperties[key]
    }

    let conditionExpressions = Object.keys(filter).map(k => `#${k} = :${k}`)
    const conditionExpression = conditionExpressions.join(' AND ')

    let updateExpressions = Object.keys(data).map(k => `#${k} = :${k}`)
    const updateExpression = 'set ' + updateExpressions.join(', ')

    return {
      conditionExpression,
      updateExpression,
      expressionAttributeNames,
      expressionAttributeValues
    }
  }
}