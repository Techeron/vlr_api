// Fetches details on a single event

// External Libs
const axios = require('axios');
const cheerio = require('cheerio');
const idGenerator = require('../util').idGenerator;


const fetchOneMatch = async (id) => {
    // Validate input
    // make sure id is a string of numbers
    if (!id.match(/^[0-9]+$/)) throw new Error("Invalid ID");

    return new Promise(async (resolve, reject) => {
        // fetch the page
        axios.get(`https://www.vlr.gg/${id}`)
            .then((response) => {
                // parse the page
                let $ = cheerio.load(response.data);
                const Match = new Object();

                Match.id = id;
                Match.games = new Array();
                Match.teams = new Array();
                Match.players = new Array();

                // Scores
                const MapScore = new Array();
                MapScore.push($(".match-header-vs .match-header-vs-score span").first().text().trim());
                MapScore.push($(".match-header-vs .match-header-vs-score span").last().text().trim());
                // Set Match Teams
                const TeamContainers = $(".match-header-vs .wf-title-med");
                TeamContainers.each((i, element) => {
                    Match.teams.push({
                        name: $(element).text().trim(),
                        id: idGenerator($(element).parent().parent().attr("href").split("/")[2]),
                        mapScore: MapScore[i]
                    });
                });
                // Getting Match Stats
                const StatsContainer = $(".vm-stats-container .vm-stats-game[data-game-id!='all']");
                $(StatsContainer).each((i, element) => {
                    Match.games[i] = new Object();

                    const map = $(element).find(".map").text().trim().split("\t")[0].trim();
                    Match.games[i].map = map;
                    Match.games[i].teams = new Array();
                    Match.games[i].teams[0] = new Object();
                    Match.games[i].teams[1] = new Object();
                    Match.games[i].teams[0].name = Match.teams[0].name;
                    Match.games[i].teams[1].name = Match.teams[1].name;
                    Match.games[i].teams[0].scoreAdvanced = {"c":0, "ct":0, "ot":0};
                    Match.games[i].teams[0].score = 0
                    Match.games[i].teams[1].scoreAdvanced = {"c":0, "ct":0, "ot":0};
                    Match.games[i].teams[1].score = 0
                    Match.games[i].teams[0].players = new Array();
                    Match.games[i].teams[1].players = new Array();

                    // Just add players to the Match Players array
                    if(i == 0) {
                        const PlayerContainers = $(element).find(".wf-table-inset.mod-overview tr");
                        console.log(PlayerContainers.length)
                        PlayerContainers.each((index, element) => {
                            if($(element).find(".mod-player a div:nth-child(1)").text().trim() == "") return;
                            const Player = new Object();
                            Player.name = $(element).find(".mod-player a div:nth-child(1)").text().trim();
                            Player.team = $(element).find(".mod-player a div:nth-child(2)").text().trim();
                            Player.link= `https://www.vlr.gg${$(element).find(".mod-player a").attr("href")}`;
                            const playerStats = $(element).find(".mod-stat");
                            Player.statsadvanced = new Object();
                            Player.stats = new Object();
                            playerStats.each((i, element) => {
                                console.log("Switching");
                                const ct = $(element).find(".mod-ct").text().trim();
                                const t = $(element).find(".mod-t").text().trim();
                                const ot = $(element).find(".mod-ot").text().trim();
                                const both = $(element).find(".mod-both").text().trim();
                                const data = {
                                    ct: ct,
                                    t: t,
                                    ot: ot
                                }
                                switch(i) {
                                    case 0:
                                        Player.statsadvanced.kdr = data;
                                        Player.stats.kdr = both
                                        break;
                                    case 1:
                                        Player.statsadvanced.acs = data;
                                        Player.stats.acs = both
                                        break;
                                    case 2:
                                        Player.statsadvanced.k = data;
                                        Player.stats.k = both
                                        break;
                                    case 3:
                                        Player.statsadvanced.d = data;
                                        Player.stats.d = both
                                        break;
                                    case 4:
                                        Player.statsadvanced.a = data;
                                        Player.stats.a = both
                                        break;
                                    case 5:
                                        Player.statsadvanced.kdb = data;
                                        Player.stats.kdb = both
                                        break;
                                    case 6:
                                        Player.statsadvanced.kast = data;
                                        Player.stats.kast = both
                                        break;
                                    case 7:
                                        Player.statsadvanced.adr = data;
                                        Player.stats.adr = both
                                        break;
                                    case 8:
                                        Player.statsadvanced.hs = data;
                                        Player.stats.hs = both
                                        break;
                                    case 9:
                                        Player.statsadvanced.fk = data;
                                        Player.stats.fk = both
                                        break;
                                    case 10:
                                        Player.statsadvanced.fd = data;
                                        Player.stats.fd = both
                                        break;
                                    case 11:
                                        Player.statsadvanced.fkdb = data;
                                        Player.stats.fkdb = both
                                        break;
                                    default:
                                        break;
                                }
                            });
                            Match.players.push(Player);
                        });
                    } else {
                        
                    }
                });


                resolve(Match);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

module.exports = { fetchOneMatch };
