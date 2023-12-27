import { Controller, Get, Param } from '@nestjs/common';
import { EventsService } from './events.service';
import { get } from 'http';

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get('/')
  events() {
    return this.eventsService.events();
  }
  @Get('/:page')
  eventsPage(@Param('page') page: number) {
    return this.eventsService.events(page);
  }
  @Get('/one/:id')
  event(@Param('id') id: number) {
    return this.eventsService.event(id);
  }
}
