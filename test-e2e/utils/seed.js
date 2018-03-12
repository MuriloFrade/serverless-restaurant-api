
const { DynamoDB } = require('aws-sdk')

const RESTAURANTS_TABLE = process.env.RESTAURANTS_TABLE
const MAX_ITEMS_PER_WRITE = 25
process.env.AWS_ACCESS_KEY_ID = 'AWS_ACCESS_KEY_ID'
process.env.AWS_SECRET_ACCESS_KEY = 'AWS_SECRET_ACCESS_KEY'
const db = new DynamoDB.DocumentClient({
  region: 'localhost',
  endpoint: 'http://localhost:8000'
})

module.exports = class Seed {
  constructor () {

  }

  static run () {
    //return Promise.resolve()
    return this.createRestaurants(200)
  }

  static createRestaurants (total) {
    const promises = []
    let requests = []
    let count = 0
    for (let i = 0; i < total; i++) {
      count++
      requests.push({
        PutRequest: {
          Item: {
            restaurantId: `restaurant${i}`,
            name: `restaurant ${i}`,
            created: Date.now()
          }
        }
      })

      if (count === MAX_ITEMS_PER_WRITE) {
        const requestItems = {}
        requestItems[RESTAURANTS_TABLE] = requests
        promises.push[new Promise((resolve, reject) => {
          db.batchWrite({
            RequestItems: requestItems
          }, (err, data) => {
            if (err) reject(err)
            else resolve(data)
          })
        })]

        count = 0
        requests = []
      }
    }

    return Promise.all(promises)
  }


}