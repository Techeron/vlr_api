// Fetches details on a single player

// External Libs
const axios = require('axios');
const cheerio = require('cheerio');
const { idGenerator, AgentArray } = require('../util');


const fetchOnePlayer = async (id) => {
    // Validate input
    // make sure id is a string of numbers
    if (!id.match(/^[0-9]+$/)) throw new Error("Invalid ID");
    return new Promise(async (resolve, reject) => {
        // fetch the page
        axios.get(`https://www.vlr.gg/player/${id}`)
            .then((response) => {
                // parse the page
                const $ = cheerio.load(response.data);
                let Player = new Object();
                Player.ign = $('h1.wf-title').text().trim();
                Player.name = Player.ign
                Player.realName = $('h2.player-real-name').text().trim();
                Player.id = idGenerator(id);
                Player.link = `https://www.vlr.gg/player/${id}`;
                Player.photo = cleanPhoto($('.player-header img').attr('src'));
                Player.country = cleanCountry($('.player-header .ge-text-light').text().trim());
                Player.team = idGenerator($('div.player-summary-container-1 > div:nth-child(6) > a').attr("href")?.split("/")[2]);
                Player.role = $('.profile-role').text().trim();
                Player.earnings = $('.player-summary-container-2 .wf-card:nth-child(4) span').text().trim()?.split("\n")[0];
                Player.stats = new Object();
                // Generate Player Stats
                const statsTable = $("table.wf-table").first();
                const statRows = $(statsTable).find('tr');
                const statLabels = $(statsTable).find('th');
                // Create array of stat labels
                const statLabelsArray = [];
                $(statLabels).each((i, element) => {
                    if (i == 0) statLabelsArray.push("Agent");
                    else statLabelsArray.push($(element).text().trim());
                });
                Player.stats.labels = statLabelsArray;
                Player.stats.time = "t60";
                Player.stats.times = ["t30", "t60", "t90", "tall"];
                Player.stats.data = new Array();
                // itterate through each row in the table (default t60)
                $(statRows).each((i, element) => {
                    // Create a new object for each row
                    Player.stats.data[i] = new Object();
                    // itterate through each td in the row and add it to the playerStats object
                    $(element).find('td').each((j, element) => {
                        const statLabel = statLabelsArray[j];
                        let statValue;
                        if (statLabel == "Agent") statValue = $(element).find('img').attr('src').split("/")[5].split(".")[0];
                        else if (statLabel == "Use") statValue = $(element).text().trim().split(" ")[0];
                        else statValue = $(element).text().trim();
                        Player.stats.data[i][statLabel] = statValue;
                    });
                });
                // Remove the first stat row (it's the header)
                Player.stats.data.shift();
                // Add the agent array for stats
                Player.agentStats = new Object();
                Player.agentStats.labels = AgentArray;
                for(let i = 0; i < AgentArray.length; i++) {
                    Player.agentStats[AgentArray[i]] = new Object();
                    // Add the agent stats with no data
                    for(let j = 0; j < statLabelsArray.length; j++) {
                        if(statLabelsArray[j] == "Agent") 
                            Player.agentStats[AgentArray[i]][statLabelsArray[j]] = AgentArray[i];
                        Player.agentStats[AgentArray[i]][statLabelsArray[j]] = 0;
                    }
                }
                // Add the agent stats with data
                for(let i = 0; i < Player.stats.data.length; i++) {
                    const agent = Player.stats.data[i].Agent;
                    for(let j = 0; j < statLabelsArray.length; j++) {
                        const statLabel = statLabelsArray[j];
                        if(statLabel == "Agent") continue;
                        Player.agentStats[agent][statLabel] = Player.stats.data[i][statLabel];
                    }
                }
                
                resolve(Player);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

const cleanCountry = (country) => {
    try {
        country = country.split("\n")[2].replace(/[\n,\t]/g, "");
    } catch {
        country = "";
    }
    return country;
}
const cleanPhoto = (photo) => {
    if (photo.includes('owcdn.net')) photo = `https:${photo}`;
    else photo = ""; 
    return photo.replace(/[\n,\t]/g, "");
}

module.exports = { fetchOnePlayer };
