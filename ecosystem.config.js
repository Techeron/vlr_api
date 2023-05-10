module.exports = {
  apps: [{
    name: "vlr_api",
    script: "./src/main.js",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "1G",
  }]
}
