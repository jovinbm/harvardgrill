var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
    orderUniqueCuid: {type: String, required: true, unique: true, index: true},
    timeUniqueCuid: {type: String, required: true, unique: false, index: true},
    orderIndex: {type: Number, default: 0, required: true, unique: true, index: true},
    clientName: {type: String, required: true, unique: false, index: true},
    clientDisplayName: {type: String, required: true, unique: false, index: true},
    clientUniqueCuid: {type: String, required: true, unique: false, index: true},
    clientSocketRoom: {type: String, required: true, unique: false, index: true},
    orderTime: {type: Date, default: Date.now, unique: false, required: true, index: true},
    readyTime: {type: Date, unique: false, index: true},
    declineTime: {type: Date, unique: false, index: true},
    status: {type: String, default: "processing", required: true},
    orderComponents: {type: Array, "default": [], unique: false, index: true},
    processedOrderComponents: {type: Array, "default": [], unique: false, index: true}
});

module.exports = orderSchema;