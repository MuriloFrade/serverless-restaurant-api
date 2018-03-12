"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var TYPES = {
    IRestaurantService: Symbol.for("IRestaurantService"),
    IDBConnector: Symbol.for("IDBConnector")
};
exports.TYPES = TYPES;
var dbconnector_1 = require("./dynamodb/dbconnector");
var restaurant_service_1 = require("./services/restaurant-service");
var container = new inversify_1.Container();
exports.container = container;
container.bind(TYPES.IDBConnector).to(dbconnector_1.DynamoDBConnector);
container.bind(TYPES.IRestaurantService).to(restaurant_service_1.RestaurantService);
//# sourceMappingURL=inversify.config.js.map