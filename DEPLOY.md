# Deployment Procedures

### Setting Up the Environment
Server is running Ubuntu 22.04, latest as of 11/29/2023
Instance lives at /root/services/vlr_api

### System Service
Path: /etc/systemd/system/vlrapi.service
```
[Unit]
Description=vlrapi

[Service]
ExecStart=/usr/local/bin/node /root/services/vlr_api/src/main.js
WorkingDirectory=/root/services/vlr_api
Restart=always
RestartSec=10
User=root
Group=root

[Install]
WantedBy=multi-user.target
```
##### Setup Script
```
sudo systemctl enable vlrapi.service
sudo systemctl start vlrapi.service
sudo systemctl status vlrapi.service
```