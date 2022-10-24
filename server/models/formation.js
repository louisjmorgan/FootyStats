const mappings = require('./mappings');

const formation = {
    formationId: {type: Number},
    formationName: {type: String},
    captainPlayerId: {type: Number},
    period: {type: Number},
    startMinuteExpanded: {type: Number},
    endMinuteExpanded: {type: Number},
    jerseyNumbers: {type: [Number]},
    formationSlots: {type: [Number]},
    playerIds: {type: [Number]},
    formationPositions: [{
        vertical: {type: Number},
        horizontal: {type: Number},
    }],
}

module.exports = formation;