import { Injectable } from '@nestjs/common';
import { load } from 'cheerio';
import axios from 'axios';

@Injectable()
export class PlayersService {
  agentArray: string[];
  constructor() {
    this.agentArray = [
      'astra',
      'breach',
      'brimstone',
      'chamber',
      'cypher',
      'deadlock',
      'fade',
      'gekko',
      'harbor',
      'iso',
      'jett',
      'kayo',
      'killjoy',
      'neon',
      'omen',
      'phoenix',
      'raze',
      'reyna',
      'sage',
      'skye',
      'sova',
      'viper',
      'yoru',
    ];
  }
  topPlayers() {
    return {
      msg: 'wip',
    };
  }
  eventPlayers(page: number) {
    return {
      page: page,
      msg: 'wip',
    };
  }
  teamPlayers(id: number) {
    return {
      id: id,
      msg: 'wip',
    };
  }
  async player(id: number) {
    const PlayerData = new Promise(async (resolve, reject) => {
      // fetch the page
      axios
        .get(`https://www.vlr.gg/player/${id}`)
        .then((response) => {
          // parse the page
          const $ = load(response.data);
          const Player: any = {};
          Player.ign = $('h1.wf-title').text().trim();
          Player.name = Player.ign;
          Player.realName = $('h2.player-real-name').text().trim();
          Player.id = id;
          Player.link = `https://www.vlr.gg/player/${id}`;
          Player.photo = $('.player-header img').attr('src');
          Player.country = $('.player-header .ge-text-light').text().trim();
          Player.team =
            $('div.player-summary-container-1 > div:nth-child(6) > a')
              .attr('href')
              ?.split('/')[2] ?? null;
          if (Player.team !== null) Player.team = Player.team;
          Player.role = $('.profile-role').text().trim();
          Player.earnings = $(
            '.player-summary-container-2 .wf-card:nth-child(4) span',
          )
            .text()
            .trim()
            ?.split('\n')[0];
          Player.stats = new Object();
          // Generate Player Stats
          const statsTable = $('table.wf-table').first();
          const statRows = $(statsTable).find('tr');
          const statLabels = $(statsTable).find('th');
          // Create array of stat labels
          const statLabelsArray = [];
          $(statLabels).each((i, element) => {
            if (i == 0) statLabelsArray.push('Agent');
            else statLabelsArray.push($(element).text().trim());
          });
          Player.stats.labels = statLabelsArray;
          Player.stats.time = 't60';
          Player.stats.times = ['t30', 't60', 't90', 'tall'];
          Player.stats.data = [];
          // itterate through each row in the table (default t60)
          $(statRows).each((i, element) => {
            // Create a new object for each row
            Player.stats.data[i] = new Object();
            // itterate through each td in the row and add it to the playerStats object
            $(element)
              .find('td')
              .each((j, element) => {
                const statLabel = statLabelsArray[j];
                let statValue;
                if (statLabel == 'Agent')
                  statValue = $(element)
                    .find('img')
                    .attr('src')
                    .split('/')[5]
                    .split('.')[0];
                else if (statLabel == 'Use')
                  statValue = $(element).text().trim().split(' ')[0];
                else statValue = $(element).text().trim();
                Player.stats.data[i][statLabel] = statValue;
              });
          });
          // Remove the first stat row (it's the header)
          Player.stats.data.shift();
          // Add the agent array for stats
          Player.agentStats = new Object();
          Player.agentStats.labels = this.agentArray;
          for (let i = 0; i < this.agentArray.length; i++) {
            Player.agentStats[this.agentArray[i]] = new Object();
            // Add the agent stats with no data
            for (let j = 0; j < statLabelsArray.length; j++) {
              if (statLabelsArray[j] == 'Agent')
                Player.agentStats[this.agentArray[i]][statLabelsArray[j]] =
                  this.agentArray[i];
              Player.agentStats[this.agentArray[i]][statLabelsArray[j]] = 0;
            }
          }
          // Add the agent stats with data
          for (let i = 0; i < Player.stats.data.length; i++) {
            const agent = Player.stats.data[i].Agent;
            for (let j = 0; j < statLabelsArray.length; j++) {
              const statLabel = statLabelsArray[j];
              if (statLabel == 'Agent') continue;
              Player.agentStats[agent][statLabel] =
                Player.stats.data[i][statLabel];
            }
          }

          resolve(Player);
        })
        .catch((err) => {
          reject(err);
        });
    });
    return await PlayerData;
  }
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
