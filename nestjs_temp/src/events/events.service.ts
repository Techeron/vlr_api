import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { load } from 'cheerio';

@Injectable()
export class EventsService {
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
  event(id: number) {
    console.log(id);
    return {
      id,
      name: 'Nest.js Rocks!',
    };
  }
}
