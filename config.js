'use strict';

var config = require('./config/config.default'),
    validateConfig = require('webgme/config/validator');

config.server.port = 80;

config.authentication.enable = true;
config.authentication.allowGuests = false;

config.executor.enable = true;

config.core.enableCustomConstraints = true;

config.plugin.allowServerExecution = true;

config.seedProjects.enable = true;
config.seedProjects.basePaths = ["./src/seeds"]
config.seedProjects.defaultProject = "ROSMOD"

//config.client.defaultProject = { name: 'guest+ROSMOD' };
config.client.log.level = 'info';

config.visualization.svgDirs = ["./src/svgs"]  

validateConfig(config);
module.exports = config;