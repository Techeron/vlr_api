import { Module } from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayersController } from './players.controller';

@Module({
  providers: [PlayersService],
  controllers: [PlayersController],
})
export class PlayersModule {}
