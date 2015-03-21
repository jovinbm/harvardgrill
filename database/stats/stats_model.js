var mongoose = require('mongoose');
var statsSchema = require('./stats_schema.js');

var Stats = mongoose.model('Stats', statsSchema);
module.exports = Stats;