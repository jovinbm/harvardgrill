var mongoose = require('mongoose');
var orderSchema = require('./order_schema.js');

var Order = mongoose.model('Order', orderSchema);
module.exports = Order;