// Fetches all events from the /events page

// External Libs
const axios = require('axios');
const cheerio = require('cheerio');
const idGenerator = require('../util').idGenerator;


const fetchAllEvents = async (pages = 1) => {
    // Validate input
    if(pages < 1) throw new Error("Pages must be greater than 0");
    if(pages > 10) pages = 10;

    // Set return object
    let Events = new Array();

    // Fetch all pages
    let eventPages = new Array();
    for(let i = 0; i < pages; i++) {
        eventPages.push(axios.get(`https://www.vlr.gg/events/?page=${i+1}`));
    }
    let eventPagesData = await Promise.all(eventPages);

    // Parse all pages
    for(let i = 0; i < eventPagesData.length; i++) {
        let $ = cheerio.load(eventPagesData[i].data);
        $('.event-item').each((i, element) => {
            const eventTitle = $(element).find('.event-item-title').text().trim();
            const eventDate = $(element).find('.event-item-desc-item.mod-dates').text().trim().split("\t")[0];
            const eventStatus = $(element).find('.event-item-desc-item-status').text().trim();
            const eventPrize = $(element).find('.event-item-desc-item.mod-prize').text().trim().split("\t")[0];
            const eventRegion = $(element).find('.event-item-desc-item.mod-location > i').attr("class").split(" ")[1].split("-")[1].toUpperCase();
            let eventLogo = "https:" + $(element).find('.event-item-thumb > img').attr('src');
            if(!eventLogo.includes("https://")) {
                // Check if it has 1 slash or none
                if(eventLogo.includes("https:/")) {
                    // It has 1 slash, add another
                    eventLogo = eventLogo.replace("https:/", "https://");
                } else {
                    // It has no slashes, add 2
                    eventLogo = eventLogo.replace("https:", "https://");
                }
            }
            const eventLink = $(element).attr('href');
            const eventId = eventLink.split('/')[2];
            if (eventStatus == "Completed") return;
            Events.push({
                type: "event",
                name: eventTitle,
                title: eventTitle,
                date: eventDate,
                status: eventStatus,
                prize: eventPrize,
                region: eventRegion,
                logo: eventLogo,
                link: `https://www.vlr.gg${eventLink}`,
                id: idGenerator(eventId)
            });
        });
    }
    return Events;
}

module.exports = { fetchAllEvents };
