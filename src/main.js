//** This is the NO-DATABASE api for vlr.gg */
//** This means it only provides the JSON equivelent of the data provided on the VLR.GG site */
// DOTENV
const path = require('path');
require("dotenv").config({ path: 
    path.join(__dirname, "../", ".env")
})
// External Libs
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const winston = require('winston');
const url = require('url');

// Internal Libs
const { fetchAllEvents } = require('./scrapers/event/all');
const { fetchOneEvent } = require('./scrapers/event/one');
const { fetchAllMatches } = require('./scrapers/match/all');
const { fetchOneMatch } = require('./scrapers/match/one');
const { fetchOnePlayer } = require('./scrapers/player/one');
const { fetchOneTeam } = require('./scrapers/team/one');

// Config Settings
const PORT = process.env.PORT || 3000;
const MaxPages = { 
    "event": 10,
    "match": 10,
    "news": 10,
    "player": 10,
    "team": 10,
    "lastUpdated": Date.now()
};
const Cache = {
    "event": {},
    "events": {},
    "match": {},
    "news": {},
    "player": {},
    "team": {},
    "lastUpdated": Date.now()
};
const CacheMins = 1;
const CacheTime = 1000 * 60 * CacheMins; 
// Logger setup
const defaultLogger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'vlr_api' },
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});
defaultLogger{"Test", "Test"};
// Error handling fix
if (!('toJSON' in Error.prototype))
Object.defineProperty(Error.prototype, 'toJSON', {
    value: function () {
        var alt = {};

        Object.getOwnPropertyNames(this).forEach(function (key) {
            alt[key] = this[key];
        }, this);

        // Split the stacy by /n to make it more readable
        const traceArray = alt.stack.split("\n");
        alt.stack = {"cause": traceArray[0], "trace": traceArray.slice(1)};

        return alt;
    },
    configurable: true,
    writable: true
});
// Setup Express
const app = express();
let logClients = new Array();

// Routes

// Setup 2 routes, the / route and the /api route
// The / route will be used for the website, and pull from the public folder
// the /api route will be used for the api, and do the api magic

// Log every request
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    defaultLogger.info(`${req.method} ${req.url} ${req.ip}`);

    // Cache Function (Functional but wierd)
    // let params = req.url.split("/");
    // params.shift();
    // if (params[0] != "api") return next();
    // if(params.length == 2) {
    //     // Multiple Items
    //     if ((Cache[params[1]]?.[1]?.lastUpdated + CacheTime) > Date.now()) {
    //         // Cache is still valid
    //         console.log("USING CACHE!");
    //         res.json({ status: "Success", data: Cache[params[1]][1].data, updated: Cache[params[1]][1].lastUpdated });
    //     } else {
    //         console.log("-----------------");
    //         console.log(Cache[params[1]]?.[1]?.lastUpdated + CacheTime)
    //         console.log(Date.now())
    //         console.log((Cache[params[1]]?.[1]?.lastUpdated + CacheTime) > Date.now())
    //         // Cache is invalid
    //         next();
    //     }
    // }
    // if(params.length == 3) {
    //     // Single Item
    //     if ((Cache[params[1]]?.[params[2]]?.lastUpdated + CacheTime) > Date.now()) {
    //         // Cache is still valid
    //         console.log("USING CACHE!");
    //         res.json({ status: "Success", data: Cache[params[1]][params[2]].data, updated: Cache[params[1]][params[2]].lastUpdated });
    //     } else {
    //         // Cache is invalid
    //         next();
    //     }
    // } else {
    //     // Cache is invalid
    //     next();
    // }
    next();
});
// For fetch requests body parsing
app.use(express.json());
app.use(express.static('src/public'));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// API
app.get("/api", (req, res) => {
    res.json({
        status: "Success",
        message: "Welcome to the Unofficial vlr.gg API",
        endpoints: [
            {
                name: "Event",
                description: "Returns a single event",
                url: "/api/event/:id",
                method: "GET",
                params: [
                    {
                        name: "id",
                        type: "String",
                        description: "The id of the event to return"
                    }
                ],
                returns: "Event Object"
            },
            {
                name: "Events",
                description: "Returns a list of all events",
                url: "/api/events",
                method: "GET",
                params: [],
                returns: "Array of Event Objects"
            },
            {
                name: "Match",
                description: "Returns a single match",
                url: "/api/match/:id",
                method: "GET",
                params: [
                    {
                        name: "id",
                        type: "String",
                        description: "The id of the match to return"
                    }
                ],
                returns: "Match Object"
            },
            {
                name: "Matches",
                description: "Returns a list of all matches",
                url: "/api/matches",
                method: "GET",
                params: [],
                returns: "Array of Match Objects"
            },
            {
                name: "News",
                description: "Returns a list of all news articles",
                url: "/api/news",
                method: "GET",
                params: [],
                returns: "Array of News Objects"
            },
            {
                name: "Player",
                description: "Returns a single player",
                url: "/api/player/:id",
                method: "GET",
                params: [
                    {
                        name: "id",
                        type: "String",
                        description: "The id of the player to return"
                    }
                ],
                returns: "Player Object"
            },
            {
                name: "Players",
                description: "Returns a list of all players",
                url: "/api/players",
                method: "GET",
                params: [],
                returns: "Array of Player Objects"
            },
            {
                name: "Rankings",
                description: "Returns a list of all rankings",
                url: "/api/rankings/:region",
                method: "GET",
                params: [
                    {
                        name: "region",
                        type: "String",
                        description: "The region to return rankings for"
                    },
                ],
            },
            {
                name: "Team",
                description: "Returns a single team",
                url: "/api/team/:id",
                method: "GET",
                params: [
                    {
                        name: "id",
                        type: "String",
                        description: "The id of the team to return"
                    }
                ],
                returns: "Team Object"
            },
            {
                name: "Teams",
                description: "Returns a list of all teams",
                url: "/api/teams",
                method: "GET",
                params: [],
                returns: "Array of Team Objects"
            },
            
        ],
        info: {
            dataLayout: {
                status: "Success || Failed",
                error: "(optional) Error Message",
                data: "Returned Data",
                keys: "Array of keys for the data",
                message: "(optional) Message, typically used for debugging"
            }
        },
        version: "1.0.0",
        author: "Cody Krist",
        lastUpdated: "5/9/2023",
        CurrentCacheTime: CacheMins + " Minutes",
        MaxPages: MaxPages
    });
});
// Events
app.get("/api/event/:id", async (req, res) => {
    const id = req.params.id;
    fetchOneEvent(req.params.id).then((data) => {
        res.json({ status: "Success", data: data });
    }).catch((err) => {
        console.error(err);
        res.json({ status: "Failed", error: err });
    });
});
app.get("/api/events/:page?", async (req, res) => {
    // Validate input
    // if Page is not a number, default to 1
    if (isNaN(req.params.page)) req.params.page = 1;
    // if Page is less than 1, default to 1
    if (req.params.page < 1) req.params.page = 1;
    // if Page is greater than 10, default to 10
    if (req.params.page > 10) req.params.page = 10;    
    fetchAllEvents(req.params.page).then((data) => {
        let lastUpdated = Date.now();
        Cache.events[req.params.page] = {lastUpdated,data};
        res.json({ status: "Success", data: data });
    }).catch((err) => {
        res.json({ status: "Failed", error: err });
    });
});
// Logs
app.get("/api/log", async (req, res) => {
    // Server event stream to send updates to clients
    res.set({
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
    });
    res.flushHeaders();
    // Add client to list
    logClients.push(res);
    // Remove client from list when they disconnect
    req.on("close", () => {
        logClients = logClients.filter((client) => client !== res);
    });
});
// Matches
app.get("/api/match/:id", async (req, res) => {
    fetchOneMatch(req.params.id).then((data) => {
        res.json({ status: "Success", data: data });
    }).catch((err) => {
        res.json({ status: "Failed", error: err });
    });
});
app.get("/api/matches/:id?", async (req, res) => {
    const id = req.params.id;
    if(!id) {
        res.json({ status: "Failed", error: "No Event ID provided" });
        return;
    }
    fetchAllMatches(req.params.id).then((data) => {
        res.json({ status: "Success", data: data });
    }).catch((err) => {
        res.json({ status: "Failed", error: err });
    });
});
// News
app.get("/api/news", async (req, res) => {
    res.json({ status: "Success", data: "WIP" });
});
// Players
app.get("/api/player/:id", async (req, res) => {
    fetchOnePlayer(req.params.id).then((data) => {
        res.json({ status: "Success", data: data });
    }).catch((err) => {
        console.error(err);
        res.json({ status: "Failed", error: err });
    });
});
app.get("/api/players", async (req, res) => {
    res.json({ status: "Success", data: {
        message: "Please use the POST method for this endpoint",
        example: {
            ids: ["1", "2", "3"]
        }
    } });
});
app.post("/api/players", async (req, res) => {
    // Get Posted IDs from ID param
    const ids = req.body.ids;
    const retValue = [];
    const promises = [];
    console.log("IDS: " + ids);
    if(!ids || ids?.length < 1) {
        res.json({ status: "Failed", error: "No IDs provided" });
        return;
    }
    // Validate input
    ids.forEach((id) => {
        console.log(typeof id);
        promises.push(fetchOnePlayer(id).then((data) => {
            retValue.push(data);
        }).catch((err) => {
            console.error(err);
            res.json({ status: "Failed", error: err });
        }))
    });
    Promise.all(promises).then(() => {
        res.json({ status: "Success", data: retValue });
    }).catch((err) => {
        console.error(err);
        res.json({ status: "Failed", error: err });
    });
});
// Rankings
app.get("/api/rankings/:region", async (req, res) => {
    res.json({ status: "Success", data: "WIP" });
});
// Teams
app.get("/api/team/:id", async (req, res) => {
    fetchOneTeam(req.params.id).then((data) => {
        res.json({ status: "Success", data: data });
    }).catch((err) => {
        console.error(err);
        res.json({ status: "Failed", error: err });
    });
});
app.get("/api/teams", async (req, res) => {
    res.json({ status: "Success", data: "WIP" });
});
// 404 setup
app.get('/api/*', function(req, res){
    res.json({
        status: "Failed",
        error: {
            stack: {
                cause: "Invalid Endpoint",
                trace: [],
            },
            message: "Invalid Endpoint"
        }
    });
});
app.get('*', function(req, res){
    res.sendFile(path.join(__dirname, "public",'404.html'));
});

// Setup Cors

// Setup Express Server
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
})
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
// Setup Heartbeat
setInterval(() => {
    logClients.forEach((res) => {
        res.write(`data: ${JSON.stringify({ status: "Success", message: "Heartbeat" })}\n\n`);
    });
}, 1000 * 10);