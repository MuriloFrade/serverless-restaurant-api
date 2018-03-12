"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var aws_sdk_1 = require("aws-sdk");
var uuid = require("uuid/v1");
var RESTAURANTS_TABLE = process.env.RESTAURANTS_TABLE;
var tables = {
    RESTAURANTS_TABLE: { name: process.env.RESTAURANTS_TABLE, key: 'restaurantId' }
};
var IS_OFFLINE = process.env.IS_OFFLINE === 'true';
var PAGINATION_SIZE = 50;
var DynamoDBConnector = /** @class */ (function () {
    function DynamoDBConnector() {
        if (IS_OFFLINE) {
            process.env.AWS_ACCESS_KEY_ID = 'AWS_ACCESS_KEY_ID';
            process.env.AWS_SECRET_ACCESS_KEY = 'AWS_SECRET_ACCESS_KEY';
            this.db = new aws_sdk_1.DynamoDB.DocumentClient({
                region: 'localhost',
                endpoint: 'http://localhost:8000'
            });
        }
        else {
            this.db = new aws_sdk_1.DynamoDB.DocumentClient();
        }
    }
    DynamoDBConnector.prototype.createRestaurant = function (restaurant) {
        return this.sendCreate(tables.RESTAURANTS_TABLE.name, tables.RESTAURANTS_TABLE.key, restaurant);
    };
    DynamoDBConnector.prototype.getRestaurant = function (restaurantId) {
        return this.sendGet(tables.RESTAURANTS_TABLE.name, tables.RESTAURANTS_TABLE.key, restaurantId);
    };
    DynamoDBConnector.prototype.updateRestaurant = function (restaurantId, filter, data) {
        return this.sendUpdate(tables.RESTAURANTS_TABLE.name, tables.RESTAURANTS_TABLE.key, restaurantId, {}, data);
    };
    DynamoDBConnector.prototype.deleteRestaurant = function (restaurantId) {
        return this.sendDelete(tables.RESTAURANTS_TABLE.name, tables.RESTAURANTS_TABLE.key, restaurantId);
    };
    DynamoDBConnector.prototype.getPaginatedRestaurant = function (cursor) {
        return this.sendPaginatedScan(tables.RESTAURANTS_TABLE.name, tables.RESTAURANTS_TABLE.key, cursor);
    };
    DynamoDBConnector.prototype.sendGet = function (tableName, keyName, keyValue) {
        var _this = this;
        var key = {};
        key[keyName] = keyValue;
        return new Promise(function (resolve, reject) {
            _this.db.get({
                TableName: tableName,
                Key: key,
                ConsistentRead: false
            }, function (error, data) {
                if (error) {
                    console.error(error);
                    return reject(error);
                }
                resolve(data.Item);
            });
        });
    };
    DynamoDBConnector.prototype.sendDelete = function (tableName, keyName, keyValue) {
        var _this = this;
        var key = {};
        key[keyName] = keyValue;
        return new Promise(function (resolve, reject) {
            _this.db.update({
                TableName: tableName,
                Key: key
            }, function (error, data) {
                if (error) {
                    console.error(error);
                    return reject(error);
                }
                resolve(data);
            });
        });
    };
    DynamoDBConnector.prototype.sendCreate = function (tableName, keyName, data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            data[keyName] = uuid();
            data.created = Date.now();
            _this.db.put({
                TableName: tableName,
                Item: data
            }, function (error, data) {
                if (error) {
                    console.error(error);
                    return reject(error);
                }
                resolve(data);
            });
        });
    };
    DynamoDBConnector.prototype.sendUpdate = function (tableName, keyName, keyValue, filter, data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var key = {};
            key[keyName] = keyValue;
            var query = _this.updateQuery(key, data);
            _this.db.update({
                TableName: tableName,
                Key: key,
                ReturnValues: "ALL_NEW",
                ConditionExpression: query.conditionExpression,
                UpdateExpression: query.updateExpression,
                ExpressionAttributeNames: query.expressionAttributeNames,
                ExpressionAttributeValues: query.expressionAttributeValues
            }, function (error, dataOutput) {
                if (error) {
                    console.error(error);
                    return reject(error);
                }
                resolve(dataOutput.Attributes);
            });
        });
    };
    DynamoDBConnector.prototype.sendPaginatedScan = function (tableName, keyName, cursor) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var params = {
                TableName: tableName,
                ConsistentRead: false,
                Limit: PAGINATION_SIZE
            };
            if (cursor) {
                params['ExclusiveStartKey'][keyName] = cursor;
            }
            _this.db.scan(params, function (error, data) {
                if (error) {
                    console.error(error);
                    return reject(error);
                }
                resolve({
                    items: data.Items,
                    cursor: data.LastEvaluatedKey ? data.LastEvaluatedKey[keyName] : null
                });
            });
        });
    };
    DynamoDBConnector.prototype.updateQuery = function (filter, data) {
        delete data.restaurantId;
        data.updated = Date.now();
        var allProperties = __assign({}, filter, data);
        var expressionAttributeNames = {};
        var expressionAttributeValues = {};
        for (var key in allProperties) {
            expressionAttributeNames['#' + key] = key;
            expressionAttributeValues[':' + key] = allProperties[key];
        }
        var conditionExpressions = Object.keys(filter).map(function (k) { return "#" + k + " = :" + k; });
        var conditionExpression = conditionExpressions.join(' AND ');
        var updateExpressions = Object.keys(data).map(function (k) { return "#" + k + " = :" + k; });
        var updateExpression = 'set ' + updateExpressions.join(', ');
        return {
            conditionExpression: conditionExpression,
            updateExpression: updateExpression,
            expressionAttributeNames: expressionAttributeNames,
            expressionAttributeValues: expressionAttributeValues
        };
    };
    DynamoDBConnector = __decorate([
        inversify_1.injectable(),
        __metadata("design:paramtypes", [])
    ], DynamoDBConnector);
    return DynamoDBConnector;
}());
exports.DynamoDBConnector = DynamoDBConnector;
//# sourceMappingURL=dbconnector.js.map