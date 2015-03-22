var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    openId: {type: String, required: true, unique: true, index: true},
    uniqueCuid: {type: String, required: true, unique: true, index: true},
    socketRoom: {type: String, required: true, unique: true, index: true},
    displayName: {type: String, default: "jHarvard", required: true, unique: false},
    email: {type: String, default: "@harvardclass.com", required: true, unique: false},
    customUsername: {type: String, required: false, unique: true, index: true},
    customLoggedInStatus: {type: Number, default: 0, unique: false, index: true},
    totalOrders: {type: Number, default: 0, unique: false, index: true},
    totalUnattendedOrders: {type: Number, default: 0, unique: false, index: true},
    favouriteOrdersIndexes: {type: Array, "default": [], unique: false, index: true},
    registrationDate: {type: Date, default: Date.now, unique: false, index: true},
    lastActivity: {type: Date, default: Date.now, index: true}
});

module.exports = userSchema;