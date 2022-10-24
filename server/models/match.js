const mongoose = require('mongoose');
const matchEvent = require('./matchEvent');
const referee = require('./referee');
const team = require('./team');

const Schema = mongoose.Schema;
const MatchSchema = Schema({
    _id: {type: Number},
    playerIdNameDictionary: {type: Object},
    attendance: {type: Number},
    venueName: {type: String},
    referee: referee,
    weatherCode: {type: String},
    elapsed: {type: String},
    startTime: {type: String},
    startDate: {type: String},
    score: {type: String},
    htScore: {type: String},
    ftScore: {type: String},
    etScore: {type: String},
    pkScore: {type: String},
    statusCode: {type: Number},
    periodCode: {type: Number},
    home: team,
    away: team,
    maxMinute: {type: Number},
    minuteExpanded: {type: Number},
    maxPeriod: {type: Number},
    expandedMinutes: {type: Object},
    periodEndMinutes: {type: Object},
    commonEvents: {type: [matchEvent]},
    events: {type: [matchEvent]},
    timeoutInSeconds: {type: Number},
})

module.exports = mongoose.model('Match', MatchSchema, 'Matches');