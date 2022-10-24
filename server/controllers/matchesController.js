const Match = require('../models/match');

exports.matches_all_get = function (req, res, next) {
    Match.find({}, '_id away.name home.name ftScore')
        .exec(function(err, matches) {
            if (err) {
                return next(err);
            }
            res.json({success:true, matches: matches});
        })
}

exports.match_get = function (req, res, next) {
    Match.find({_id: req.params.id}, {"events": 0})
        .exec(function(err, match) {
            if (err) {
                return next(err);
            }
            res.json({success:true, match: match[0]});
        })
}

exports.match_events_get = function (req, res, next) {
    Match.find({_id: req.params.id}, 'events')
        .exec(function(err, events) {
            if (err) {
                return next(err);
            }
            res.json({success:true, events: events});
        })
}

exports.match_players_get = function (req, res, next) {
    Match.find({_id: req.params.id}, 'home.name home.players away.name away.players')
        .exec(function(err, results) {
            if (err) {
                return next(err);
            }
            const players = {};
            players[home.name] = results[0].home.players,
            players[away.name] = results[0].away.players,
            res.json({success:true, players: players});
        })
}