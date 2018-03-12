
interface BaseModel {
  created: number
  updated: number
}

export interface Restaurant extends BaseModel {
  restaurantId?: string,
  name: string
}

export interface ListResponse {
  cursor?: string,
  items: Restaurant []
}

export type FilterQuery =  { [key: string]: any }
