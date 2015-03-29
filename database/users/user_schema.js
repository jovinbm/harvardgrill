var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    openId: {type: String, required: true, unique: true, index: true},
    isAdmin: {type: String, required: true, default: "no", index: true},
    grillName: {type: String, required: true, default: "stats", unique: false, index: true},
    uniqueCuid: {type: String, required: true, unique: true, index: true},
    socketRoom: {type: String, required: true, unique: false, index: true},
    displayName: {type: String, default: "jHarvard", required: true, unique: false},
    email: {type: String, default: "@harvardclass.com", required: true, unique: false},
    customUsername: {type: String, required: false, unique: false, index: true},
    customLoggedInStatus: {type: Number, default: 0, unique: false, index: true},
    totalOrders: {type: Number, default: 0, unique: false, index: true},
    totalUnattendedOrders: {type: Number, default: 0, unique: false, index: true},
    favouriteOrdersIndexes: {type: Array, "default": [], unique: false, index: true},
    registrationDate: {type: Date, default: Date.now, unique: false, index: true},
    lastActivity: {type: Date, default: Date.now, index: true}
});

module.exports = userSchema;