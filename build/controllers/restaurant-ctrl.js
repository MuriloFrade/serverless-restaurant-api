"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var inversify_express_utils_1 = require("inversify-express-utils");
var inversify_config_1 = require("../inversify.config");
var utils_1 = require("./utils");
var RestaurantCtrl = /** @class */ (function () {
    function RestaurantCtrl(restaurantService) {
        this.restaurantService = restaurantService;
    }
    RestaurantCtrl.prototype.list = function (req, res) {
        return this.restaurantService.list()
            .then(function (data) { return utils_1.respondWithPagination(data, res); })
            .catch(function (error) { return utils_1.respondWithError(error, res); });
    };
    RestaurantCtrl.prototype.create = function (req, res) {
        return this.restaurantService.create(req.body)
            .then(function (restaurant) { return utils_1.respondWithCreated(restaurant, res); })
            .catch(function (error) { return utils_1.respondWithError(error, res); });
    };
    RestaurantCtrl.prototype.read = function (req, res) {
        return this.restaurantService.read(req.params.restaurantId)
            .then(function (restaurant) { return utils_1.respondWithItem(restaurant, res); })
            .catch(function (error) { return utils_1.respondWithError(error, res); });
    };
    RestaurantCtrl.prototype.updateUser = function (req, res) {
        return this.restaurantService.update(req.params.restaurantId, req.body)
            .then(function (restaurant) { return utils_1.respondWithItem(restaurant, res); })
            .catch(function (error) { return utils_1.respondWithError(error, res); });
    };
    RestaurantCtrl.prototype.deleteUser = function (req, res) {
        return this.restaurantService.delete(req.params.restaurantId)
            .then(function () { return utils_1.respondDeleted({}, res); })
            .catch(function (error) { return utils_1.respondWithError(error, res); });
    };
    __decorate([
        inversify_express_utils_1.httpGet('/'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], RestaurantCtrl.prototype, "list", null);
    __decorate([
        inversify_express_utils_1.httpPost("/"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], RestaurantCtrl.prototype, "create", null);
    __decorate([
        inversify_express_utils_1.httpGet("/:restaurantId"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], RestaurantCtrl.prototype, "read", null);
    __decorate([
        inversify_express_utils_1.httpPut('/:restaurantId'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], RestaurantCtrl.prototype, "updateUser", null);
    __decorate([
        inversify_express_utils_1.httpDelete('/:restaurantId'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], RestaurantCtrl.prototype, "deleteUser", null);
    RestaurantCtrl = __decorate([
        inversify_express_utils_1.controller('/restaurants'),
        __param(0, inversify_1.inject(inversify_config_1.TYPES.IRestaurantService)),
        __metadata("design:paramtypes", [Object])
    ], RestaurantCtrl);
    return RestaurantCtrl;
}());
exports.RestaurantCtrl = RestaurantCtrl;
//# sourceMappingURL=restaurant-ctrl.js.map