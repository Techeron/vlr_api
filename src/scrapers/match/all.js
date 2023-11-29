// Fetches details on a single event

// External Libs
const axios = require('axios');
const cheerio = require('cheerio');
const idGenerator = require('../util').idGenerator;


const fetchAllMatches = async (id) => {
    // Validate input
    // make sure id is a string of numbers
    if (!id.match(/^[0-9]+$/)) throw new Error("Invalid ID");
    return new Promise(async (resolve, reject) => {
        // fetch the page
        axios.get(`https://www.vlr.gg/event/matches/${id}`)
            .then((response) => {
                // parse the page
                let $ = cheerio.load(response.data);
                const Event = new Object();
                Event.name = $('h1.wf-title').text().trim();

                // Matches
                const MatchDates = new Array();
                // Get All Headers
                const Headers = new Array();
                const HeaderObjects = $(".col.mod-1 > .wf-label.mod-large");
                HeaderObjects.each((i, element) => {
                    Headers.push({
                        date: $(element).text().replaceAll("\n", "").replaceAll("\t", "").replace("Today", "").trim(),
                        children: $(element).next().find("a").length
                    });
                });
                // Generate All Dates
                Headers.forEach((header) => {
                    for(let i = 0; i < header.children; i++) {
                        MatchDates.push(header.date);
                    }
                })
                // Get all Matches
                const Matches = new Array();
                const MatchObjects = $(".col.mod-1 .wf-card a");
                let MatchIndex = 0;
                MatchObjects.each((i, element) => {
                    if($(element).find(".match-item-time").text().trim() === "") return;
                    Matches.push({
                        time: MatchDates[MatchIndex] + " " + $(element).find(".match-item-time").text().trim(),
                        link: `https://www.vlr.gg${$(element).attr("href")}`,
                        id: idGenerator($(element).attr("href").split("/")[1]),
                        teams: [
                            $(element).find(".match-item-vs-team-name").first().text().trim(),
                            $(element).find(".match-item-vs-team-name").last().text().trim()
                        ],
                        score: [
                            $(element).find(".match-item-vs-team-score").first().text().trim(),
                            $(element).find(".match-item-vs-team-score").last().text().trim()
                        ],
                        eta: $(element).find(".match-item-eta").text().replaceAll("\n", " ").replaceAll("\t", "").trim(),
                        series: $(element).find(".match-item-event-series").text().replaceAll("\n", " ").replaceAll("\t", "").trim()
                    });
                    MatchIndex++;
                });
                
                Event.Matches = Matches;
                Event.totalMatches = Matches.length;
                
                resolve(Event);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

module.exports = { fetchAllMatches };
