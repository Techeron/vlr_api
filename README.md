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
### `/events`
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
