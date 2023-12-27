import { Controller, Get, Param } from '@nestjs/common';
import { PlayersService } from './players.service';

@Controller('players')
export class PlayersController {
  constructor(private playersService: PlayersService) {}

  @Get('/')
  topPlayers() {
    return this.playersService.topPlayers();
  }
  @Get('/event/:id')
  eventPlayers(@Param('page') page: number) {
    return this.playersService.eventPlayers(page);
  }
  @Get('/team/:id')
  teamPlayers(@Param('id') id: number) {
    return this.playersService.teamPlayers(id);
  }
  @Get('/:id')
  player(@Param('id') id: number) {
    return this.playersService.player(id);
  }
}
