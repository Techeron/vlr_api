import { Module } from '@nestjs/common';
import { PlayersService } from './players.service';

@Module({
  providers: [PlayersService],
})
export class PlayersModule {}
