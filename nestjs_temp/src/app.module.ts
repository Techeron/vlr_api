import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { PlayersModule } from './players/players.module';
import { TeamsModule } from './teams/teams.module';
import { MatchesModule } from './matches/matches.module';
import { ApiModule } from './api/api.module';

@Module({
  imports: [EventsModule, PlayersModule, TeamsModule, MatchesModule, ApiModule],
  controllers: [],
})
export class AppModule {}
