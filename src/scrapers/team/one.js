// Fetches details on a single team

// External Libs
const axios = require('axios');
const cheerio = require('cheerio');
const { idGenerator, AgentArray } = require('../util');


const fetchOneTeam = async (id) => {
    // Validate input
    // make sure id is a string of numbers
    if (!id.match(/^[0-9]+$/)) throw new Error("Invalid ID");
    return new Promise(async (resolve, reject) => {
        // fetch the page
        axios.get(`https://www.vlr.gg/team/${id}`)
            .then((response) => {
                // parse the page
                const $ = cheerio.load(response.data);
                let Team = new Object();
                // Team Name,, Logo, Region, Socials, Roster, Staff, Earnings
                Team.name = $('h1.wf-title').text().trim();
                Team.tag = $('h2.wf-title.team-header-tag').text().trim();
                Team.logo = `https:${$('.team-header img').attr('src')}`;
                Team.id = id
                Team.country = $('.team-header-country').text().trim();
                Team.link = `https://vlr.gg/team/${id}`;
                Team.socials = new Array();
                Team.earnings = $('.team-earnings-value').text().trim();

                // Fix Logo
                if (Team.logo.includes("/img/vlr/tmp/vlr.png")) Team.logo = "https://www.vlr.gg/img/vlr/tmp/vlr.png";
                // Get Socials
                $('.team-header-links a').each(async (i, element) => {
                    let socialLink = $(element).attr('href');
                    if (socialLink === "" || socialLink === undefined) return;
                    // add https if not there
                    if (!socialLink.includes("https://")) socialLink = "https://" + socialLink;
                    let socialURL;
                    try {
                        socialURL = new URL(socialLink);
                    } catch {
                        defaultLogger.error("Error setting socialURL: " + socialLink + " | Page: " + url, false);
                        defaultLogger.info("FUCKING SOCIAL LINKS CAN SUCK MY ASS")
                        process.exit();
                        return;
                    }
                    const socialName = socialURL.hostname;
                    Team.socials.push({ name: socialName, link: socialLink });
                });
                // Generaate Players and Staff
                Team.players_item = new Array();
                Team.staff_item = new Array();
                $('.team-roster-item').each((i, element) => {
                    const playerLink = $(element).find('.team-roster-item a').attr('href');
                    if (playerLink === "" || playerLink === undefined) return;
                    const playerURL = new URL(playerLink, "https://www.vlr.gg");
                    const playerId = playerURL.pathname.split("/")[2];
                    const playerIgn = $(element).find('.team-roster-item-name-alias').text().trim();
                    const playerRealName = $(element).find('.team-roster-item-name-real').text().trim();
                    let playerRole = $(element).find('.team-roster-item-name-role')?.text().trim();
                    if (playerRole === "" || playerRole === undefined) {
                        playerRole = "player";
                        Team.players_item.push({ ign: playerIgn, link: `https://www.vlr.gg${playerLink}`, id: idGenerator(playerId), role: playerRole });
                    } else {
                        Team.staff_item.push({ ign: playerIgn, link: `https://www.vlr.gg${playerLink}`, id: idGenerator(playerId), role: playerRole });
                    }

                });

                
                // Generate team.players array of ids
                Team.players = new Array();
                Team.players_item.forEach((player) => {
                    Team.players.push(idGenerator(player.id));
                });
                // Generate team.staff array of ids
                Team.staff = new Array();
                Team.staff_item.forEach((player) => {
                    Team.staff.push(idGenerator(player.id));
                });

                resolve(Team);
            })
            .catch((err) => {
                // if 404 then return a custom error
                if (err.response.status == 404) {
                    reject(new Error("Team Not Found"));
                } else {
                    reject(err);
                }
            });
    });
}


module.exports = { fetchOneTeam };
