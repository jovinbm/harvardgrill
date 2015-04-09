var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    openId: {type: String, required: true, unique: true, index: true},
    uniqueCuid: {type: String, required: true, unique: true, index: true},
    socketRoom: {type: String, required: true, unique: false, index: true},
    isAdmin: {type: String, required: true, default: "no", index: true},
    firstName: {type: String, default: "", unique: false, index: true},
    lastName: {type: String, default: "", unique: false, index: true},
    fullName: {type: String, default: "", unique: false, index: true},
    username: {type: String, default: "", unique: false, index: true},
    email: {type: String, default: "", unique: false, index: true},
    password: {type: String, default: "", unique: false, index: true},
    customLoggedInStatus: {type: Number, default: 0, unique: false, index: true},
    grillName: {type: String, required: true, default: "default", unique: false, index: true},
    totalOrders: {type: Number, default: 0, unique: false, index: true},
    totalUnattendedOrders: {type: Number, default: 0, unique: false, index: true},
    favouriteOrdersIndexes: {type: Array, "default": [], unique: false, index: true},
    registrationDate: {type: Date, default: Date.now, unique: false, index: true},
    lastActivity: {type: Date, default: Date.now, index: true}
});

module.exports = userSchema;