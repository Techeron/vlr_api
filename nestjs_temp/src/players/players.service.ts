import { Injectable } from '@nestjs/common';

@Injectable()
export class PlayersService {
  one(id: number) {
    return {
      id: id,
      msg: 'wip',
    };
  }
  all(teamId: number) {
    return {
      id: teamId,
      msg: 'wip',
    };
  }
}
