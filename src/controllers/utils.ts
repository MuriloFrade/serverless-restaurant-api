
import { Response, Request } from 'express'

export {
  respondWithCreated,
  respondWithError,
  respondWithItem,
  respondDeleted,
  respondWithPagination
}

function respondWithCreated (data: any, res: Response) {
  res.status(201)
  res.json({ data })
}

function respondWithError (error: Error, res: Response) {
  res.status(400)
  res.json({ error: error.message })
}

function respondWithItem (data: any, res: Response) {
  res.status(200)
  res.json({ data })
}

function respondDeleted (data: any, res: Response) {
  res.status(200)
}

function respondWithPagination (data: any, res: Response) {
  res.status(200)
  res.json({
    data: data.items,
    pagination: {
      cursor: data.cursor
    }
  })
}