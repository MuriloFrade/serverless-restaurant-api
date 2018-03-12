"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
require("reflect-metadata");
var serverless = require("serverless-http");
var inversify_express_utils_1 = require("inversify-express-utils");
var bodyParser = require('body-parser');
inversify_express_utils_1.cleanUpMetadata();
require("./controllers/restaurant-ctrl");
var inversify_config_1 = require("./inversify.config");
//import { Router } from './router'
// const app = express()
// app.use(bodyParser.json())
//Router.createRoutes(app)
var server = new inversify_express_utils_1.InversifyExpressServer(inversify_config_1.container);
server.setConfig(function (app) {
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json({ strict: false }));
});
var app = server.build();
var serverlessApp = serverless(app);
exports.handler = serverlessApp;
//# sourceMappingURL=app.js.map