import { Injectable } from '@nestjs/common';

@Injectable()
export class TeamsService {
  one(id: number) {
    return {
      id: id,
      msg: 'wip',
    };
  }
  all(eventId: number) {
    return {
      id: eventId,
      msg: 'wip',
    };
  }
}
