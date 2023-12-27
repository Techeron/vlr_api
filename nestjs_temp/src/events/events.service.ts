import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { load } from 'cheerio';

@Injectable()
export class EventsService {
  // Fetch events from vlr.gg/events/:page
  async events(page: number = 1) {
    // Validate Input
    if (page < 1) throw new Error('Pages must be greater than 0');
    else if (page > 10) page = 10;

    // Set return object
    const Events = [];

    // Fetch all pages
    const eventPagesData = await axios.get(
      `https://www.vlr.gg/events/?page=${page}`,
    );

    // Parse Page
    const $ = load(eventPagesData.data);
    $('.event-item').each((i, element) => {
      const eventTitle = $(element).find('.event-item-title').text().trim();
      const eventDate = $(element)
        .find('.event-item-desc-item.mod-dates')
        .text()
        .trim()
        .split('\t')[0];

      const eventStatus = $(element)
        .find('.event-item-desc-item-status')
        .text()
        .trim();
      const eventPrize = $(element)
        .find('.event-item-desc-item.mod-prize')
        .text()
        .trim()
        .split('\t')[0];
      const eventRegion = $(element)
        .find('.event-item-desc-item.mod-location > i')
        .attr('class')
        .split(' ')[1]
        .split('-')[1]
        .toUpperCase();
      let eventLogo =
        'https:' + $(element).find('.event-item-thumb > img').attr('src');
      if (!eventLogo.includes('https://')) {
        // Check if it has 1 slash or none
        if (eventLogo.includes('https:/')) {
          // It has 1 slash, add another
          eventLogo = eventLogo.replace('https:/', 'https://');
        } else {
          // It has no slashes, add 2
          eventLogo = eventLogo.replace('https:', 'https://');
        }
      }
      const eventLink = $(element).attr('href');
      const eventId = eventLink.split('/')[2];
      if (eventStatus == 'Completed') return;
      Events.push({
        type: 'event',
        name: eventTitle,
        title: eventTitle,
        date: eventDate,
        status: eventStatus,
        prize: eventPrize,
        region: eventRegion,
        logo: eventLogo,
        link: `https://www.vlr.gg${eventLink}`,
        id: eventId,
      });
    });
    return Events;
  }
  // Fetch a singular event from vlr.gg/event/:id
  async event(id: number) {
    // make sure id is a string of numbers
    const EventData = new Promise(async (resolve, reject) => {
      // fetch the page
      axios
        .get(`https://www.vlr.gg/event/${id}`)
        .then((response) => {
          // parse the page
          const $ = load(response.data);
          const Event: any = {};
          Event.name = $('h1.wf-title').text().trim();

          // Get all teams
          const Teams = [];
          try {
            $('.event-team').each((i, element) => {
              const teamName = $(element)
                .find('.event-team-name')
                .text()
                .trim();
              const teamLogo = $(element)
                .find('.event-team-players-mask > img')
                .attr('src');
              const teamLink = $(element).find('.event-team-name').attr('href');
              const teamId = teamLink.split('/')[2];
              const teamPlayers = [];
              Teams.push({
                type: 'team',
                name: teamName,
                logo: `https:${teamLogo}`,
                link: `https://www.vlr.gg${teamLink}`,
                id: teamId,
                players: teamPlayers,
              });
            });
          } catch (err) {
            throw err;
          }

          // Get all players
          const Players = [];
          const FailedLinks = [];
          $('.event-team-players-item').each((i, element) => {
            const playerLink = $(element).attr('href');
            let playerId;
            try {
              playerId = playerLink.split('/')[2];
            } catch (err) {
              // Player ID does not exist, just return
              return;
            }
            if (playerId === null || playerId === undefined) return;
            const playerIgn = $(element).text().trim();
            const playerTeamName = $(element)
              .parent()
              .parent()
              .find('.event-team-name')
              .text()
              .trim();
            const playerTeamId = $(element)
              .parent()
              .parent()
              .find('.event-team-name')
              .attr('href')
              .split('/')[2];
            for (let i = 0; i < Teams.length; i++) {
              if (Teams[i].name == playerTeamName) {
                Teams[i].players.push({
                  type: 'player',
                  ign: playerIgn,
                  link: `https://www.vlr.gg${playerLink}`,
                  id: playerId,
                });
              }
            };
            Players.push({
              type: 'player',
              name: playerIgn,
              ign: playerIgn,
              link: `https://www.vlr.gg${playerLink}`,
              id: playerId,
              team: {
                type: 'team',
                name: playerTeamName,
                id: playerTeamId,
              },
            });
          });

          Event.teams_item = Teams;
          Event.players_item = Players;
          Event.failed_links = FailedLinks;
          resolve(Event);
        })
        .catch((err) => {
          reject(err);
        });
    });
    return await EventData;
  }
}
