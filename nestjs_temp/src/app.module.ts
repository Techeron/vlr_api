import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { PlayersModule } from './players/players.module';
import { TeamsModule } from './teams/teams.module';
import { MatchesModule } from './matches/matches.module';

@Module({
  imports: [EventsModule, PlayersModule, TeamsModule, MatchesModule],
  controllers: [],
})
export class AppModule {}
