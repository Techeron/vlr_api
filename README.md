# The Ultimate Vlr.gg API
Welcome to the ultimate vlr.gg api, designed to give you as much access to the api as you need.
This is the standalone version, but there will be a npm package created in the future to allow you to skip needing this api in the firstplace!
# Endpoints

All endpoints are relative to the domain root

### `/event/:id`
- Method: `GET`
- Response:
  ```json
  {
      "status": "Success || Failed",
      "data": {
        "name": "Event Name",
        "teams_item": [
            {
                "type": "team",
                "name": "Team 1 Name",
                "logo": "link to logo",
                "link": "link to vlr.gg team entry",
                "id": "15 digit unique id (usable on vlr.gg and pocketbase)",
                "players": [
                    {
                        "type": "player"
                        "ign": "in-game name",
                        "link": "link to the vlr.gg player entry",
                        "id": "Player's unique id"
                    }
                ]
            }
        ],
        "players_item": [
            {
                "type": "player",
                "ign": "in-game name",
                "link": "link to the vlr.gg player entry",
                "id": "Player's unique id",
                "team": {
                    "type": "team",
                    "name": "Team Name",
                    "id": "Team Unique Id"
                }
            }
        ],
        "failed_links": [
            "Links that failed to be parsed go here (debugging)"
        ]
      },
      "error": {
        "stack": {
            "cause": "Cause of error",
            "trace": [
                "at dir/goes/here/main.js:1:1",
                "at dir/goes/here/folder/scraper.js:42:13"
            ],
        },
        "message": "error.message value",
      }
  }
  ```
### `/events/:pages`
- Method: `GET`
- Response:
  ```json
  {
      "status": "Success || Failed",
      "data": [
        {
            "type": "event",
            "title": "Name of event",
            "name": "Name of event",
            "date": "Date of event",
            "status": "ongoing || completed || upcoming",
            "prize": "$1.111 || TBD",
            "region": "EU || US || etc...",
            "logo":  "Link to logo",
            "link": "vlr.gg/event/:id",
            "id": "unique id"
        }
      ]
      "error": {
        "stack": {
            "cause": "Cause of error",
            "trace": [
                "at dir/goes/here/main.js:1:1",
                "at dir/goes/here/folder/scraper.js:42:13"
            ],
        },
        "message": "error.message value",
      }
  }
  ```
### `/match/:id`
### `/matches`
### `/news`
### `/player/:id`

  ```json
{
    "status": "Success",
    "data": {
        "ign": "Asuna",
        "name": "Asuna",
        "realName": "Peter Mazuryk",
        "id": "000000000000601",
        "link": "https://www.vlr.gg/player/601",
        "photo": "https://owcdn.net/img/641692800624c.png",
        "country": "UNITED STATES",
        "team": "000000000000120",
        "role": "",
        "earnings": "$66,950",
        "stats": {
        "labels": [
            "Agent", ...
        ],
        "time": "t60",
        "times": [
            "t30",
            "t60",
            "t90",
            "tall"
        ],
        "data": [
            {
            "Agent": "skye",
            "Use": "(4)",
            "RND": "82",
            "Rating": "1.16",
            "ACS": "211.8",
            "K:D": "1.19",
            "ADR": "137.1",
            "KAST": "71%",
            "KPR": "0.78",
            "APR": "0.37",
            "FKPR": "0.09",
            "FDPR": "0.09",
            "K": "64",
            "D": "54",
            "A": "30",
            "FK": "7",
            "FD": "7"
            }, ...
        ]
        },
        "agentStats": {
            "labels": [
                "astra",...
            ],
            "astra": {
                "Agent": 0,
                "Use": 0,
                "RND": 0,
                "Rating": 0,
                "ACS": 0,
                "K:D": 0,
                "ADR": 0,
                "KAST": 0,
                "KPR": 0,
                "APR": 0,
                "FKPR": 0,
                "FDPR": 0,
                "K": 0,
                "D": 0,
                "A": 0,
                "FK": 0,
                "FD": 0
            },...
        }
    }
}
  ```
### `/players`

### `/rankings/<region>`

### `/team/:id`

### `/teams`

## Installation

### Source

```
$ git clone https://github.com/Techeron/vlr_api/
$ cd vlr_api
$ npm install
```

### Usage

```
$ npm run debug
```

## Contributing

Feel free to submit a [pull request](https://github.com/Techeron/vlr_api/pull/new/master) or an [issue](https://github.com/Techeron/vlr_api/issues/new)!

## License

The MIT License (MIT)
