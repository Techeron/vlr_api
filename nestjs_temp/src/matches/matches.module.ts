import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';

@Module({
  providers: [MatchesService],
  controllers: [MatchesController]
})
export class MatchesModule {}
