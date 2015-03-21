var mongoose = require('mongoose');
var componentSchema = require('./component_schema.js');

var Component = mongoose.model('Component', componentSchema);
module.exports = Component;