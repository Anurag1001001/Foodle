"use strict";
exports.__esModule = true;
exports.OrderDoc = exports.DishState = exports.OrderState = void 0;
var OrderState;
(function (OrderState) {
    OrderState["NEW"] = "new";
    OrderState["PROCESSING"] = "processing";
    OrderState["READY"] = "ready";
    OrderState["SHIPPED"] = "shipped";
    OrderState["DELIVERED"] = "delivered";
})(OrderState = exports.OrderState || (exports.OrderState = {}));
var DishState;
(function (DishState) {
    DishState["NEW"] = "new";
    DishState["PROCESSING"] = "processing";
    DishState["READY"] = "ready";
    DishState["SHIPPED"] = "shipped";
    DishState["DELIVERED"] = "delivered";
})(DishState = exports.DishState || (exports.DishState = {}));
var OrderDoc = /** @class */ (function () {
    function OrderDoc(createdAt, deliveryAddress, estimatedDeliveryFrom, estimatedDeliveryTo, kitchens, recipient, meta, number, orderId, delivery, status) {
        this.createdAt = createdAt;
        this.deliveryAddress = deliveryAddress;
        this.estimatedDeliveryFrom = estimatedDeliveryFrom;
        this.estimatedDeliveryTo = estimatedDeliveryTo;
        this.kitchens = kitchens;
        this.recipient = recipient;
        this.meta = meta;
        this.number = number;
        this.orderId = orderId;
        this.delivery = delivery;
        this.status = status;
    }
    return OrderDoc;
}());
exports.OrderDoc = OrderDoc;
