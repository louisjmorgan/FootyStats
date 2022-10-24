const typeSchema = {
    value: {type: Number},
    displayName: {type: String},
}
const matchEvent = {
    id: {
        $numberLong: {type: Number},
    },
    eventId: {type: Number},
    minute: {type: Number},
    second: {type: Number},
    teamId: {type: Number},
    playerId: {type: Number},
    x: {type: Number},
    y: {type: Number},
    expandedMinute: {type: Number},
    period: typeSchema,
    type: typeSchema,
    outcomeType: typeSchema,
    qualifiers: {type: [typeSchema]},
    satisfiedEventsTypes: {type: [Number]},
    isTouch: {type: Boolean},
};

module.exports = matchEvent;