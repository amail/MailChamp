var fs = require('fs');
var path = require('path');
var Judge = require('./judge.js').Judge;

// Object construct
var Game = exports.Game = function(){};

// Retrieve the names of all the players available
Game.prototype.getAvailablePlayers = function(){
    var players = [];
    var outerScope = this;
    var files = fs.readdirSync(this.getConfigDirectoryPath());

    files.forEach(function(fileName){
        if(fileName.indexOf('.json', fileName - '.json'.length) !== -1){
            var playerName = fileName.substr(0, fileName.lastIndexOf('.'));
            if(outerScope.validatePlayerName(playerName)){
                players.push(playerName);
            }
        }
    });

    return players;
};

// Assert whether or not a player exists
Game.prototype.validatePlayerName = function(playerName){
    return fs.existsSync(this.getPlayerConfigFilePath(playerName))
        && fs.existsSync(this.getPlayerDirectoryPath(playerName));
};

// Retrieves the configuration/metadata for a player KVP
Game.prototype.getPlayerConfig = function(playerName){
    var result = {};

    if(!this.validatePlayerName(playerName)){
        return false;
    }

    var manifest = this.getPlayerManifest(playerName);
    var config = JSON.parse(fs.readFileSync(this.getPlayerConfigFilePath(playerName), 'UTF-8'));

    for(var key in manifest.default_config){
        result[key] = manifest.default_config[key];
    }

    for(var key in config){
        result[key] = config[key];
    }

    return result;
};

// Retrive the manifest for a specific player
Game.prototype.getPlayerManifest = function(playerName){
    if(!this.validatePlayerName(playerName)){
        return false;
    }

    return JSON.parse(fs.readFileSync(this.getPlayerManifestFilePath(playerName), 'UTF-8'));
};

// Retrieves a player by name
Game.prototype.getPlayer = function(playerName){
    if(!this.validatePlayerName(playerName)){
        return false;
    }

    var config = this.getPlayerConfig(playerName);
    var player = require(this.getPlayerDirectoryPath(playerName) + '/player.js');

    return new player.Player(config);
};

// Runs a match on a player. Returns match results
Game.prototype.run = function(player, gameData, callback){
    var judge = new Judge(player, gameData, callback);
    judge.startGame();
    return judge;
};

// File path helpers

Game.prototype.getConfigDirectoryPath = function(playerName){
    return path.resolve(__dirname, '../config/');
};

Game.prototype.getPlayerDirectoryPath = function(playerName){
    return path.resolve(__dirname, '../players/') + '/' + playerName + '/';
};

Game.prototype.getPlayerConfigFilePath = function(playerName){
    return path.resolve(__dirname, '../config/'+playerName+'.json');
};

Game.prototype.getPlayerManifestFilePath = function(playerName){
    return path.resolve(__dirname, '../players/'+playerName+'/manifest.json');
};

// Helper method for creating a new game
exports.create = function(){
    return new Game();
};