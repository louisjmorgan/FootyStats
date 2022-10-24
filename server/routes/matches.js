var express = require('express');
var router = express.Router();

matches_controller = require('../controllers/matchesController.js');

router.get('/', matches_controller.matches_all_get);

router.get('/:id/', matches_controller.match_get);

router.get('/:id/events', matches_controller.match_events_get);

router.get('/:id/players', matches_controller.match_players_get);

module.exports = router;