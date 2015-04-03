var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var statsSchema = new Schema({
    grillName: {type: String, required: true, default: "stats", unique: false, index: true},
    grillStatus: {type: String, required: true, default: "closed", unique: false, index: true},
    timeUniqueCuid: {type: String, required: true, default: "abcde", index: true},
    totalOrders: {type: Number, default: 0, required: true, unique: false, index: true},
    totalProcessedOrders: {type: Number, default: 0, required: true, unique: false, index: true},
    totalDeclinedOrders: {type: Number, default: 0, required: true, unique: false, index: true}
});

module.exports = statsSchema;