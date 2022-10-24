// initialize database
require('dotenv').config()

var mongoose = require('mongoose');
const mongoDb = process.env.MONGODB
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));
var Match = require('../models/match')


function denestData(Match) {
    Match.updateMany({},
    [
        {
            $replaceRoot: {
                newRoot:
                    {$mergeObjects: ["$matchCentreData", "$$ROOT"]}
            }
        },
        {$unset: "matchCentreData"}
    ],
        function (err, docs) {
            if (err){
                console.log(err)
            }
            else{
                console.log("Updated Docs : ", docs);
            }
        }
    );
};

function mergeIds(Match) {
    Match.aggregate([
        {
            $addFields:{
                "_id":"$matchId"
            }
        },
        {
            $project:{
                "matchId":0
            }
        },
        {
            $out:"Matches"
        },
        function (err, docs) {
            if (err){
                console.log(err)
            }
            else{
                console.log("Updated Docs : ", docs);
            }
        }
    ])
}

// TODO: normalize mappings e.g. event types, periods, formation positions etc.