import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';

@Module({
  providers: [TeamsService],
  controllers: [TeamsController],
})
export class TeamsModule {}
