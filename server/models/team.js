const formation = require('./formation');
const matchEvent = require('./matchEvent');
const player = require('./player');

const shotZone = {
    stats: {
        type: Object,
    }
};

const team = {
    teamId: {type: String},
    formations: [formation],
    stats: {type: Object},
    incidentEvents: {type: [matchEvent]},
    shotZones: {
        missHighLeft: shotZone,
        missHighCentre: shotZone,
        missHighRight: shotZone,
        missLeft: shotZone,
        missRight: shotZone,
        postLeft: shotZone,
        postCentre: shotZone,
        postRight: shotZone,
        onTargetHighLeft: shotZone,
        onTargetHighCentre: shotZone,
        onTargetHighRight: shotZone,
        onTargetLowLeft: shotZone,
        onTargetLowCentre: shotZone,
        onTargetLowRight: shotZone,
    },
    name: {type: String},
    countryName: {type: String},
    players: {type: [player]},
    managerName: {type: String},
    scores: {
        halftime: {type: Number},
        fulltime: {type: Number},
        running: {type: Number},
    },
    field: {type: String},
    averageAge: {type: Number},
};

module.exports = team;