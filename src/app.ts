
import 'source-map-support/register'
import 'reflect-metadata'
import serverless = require('serverless-http')
import { interfaces, InversifyExpressServer, TYPE, cleanUpMetadata } from 'inversify-express-utils'
const bodyParser = require('body-parser')

cleanUpMetadata()
import './controllers/restaurant-ctrl'
import { container } from './inversify.config'

//import { Router } from './router'

// const app = express()
// app.use(bodyParser.json())

//Router.createRoutes(app)

const server = new InversifyExpressServer(container)
server.setConfig((app) => {
  app.use(bodyParser.urlencoded({
    extended: true
  }))
  app.use(bodyParser.json({ strict: false }))
})

const app = server.build()
const serverlessApp = serverless(app)
export { serverlessApp as handler }
