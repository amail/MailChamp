var Game = require('./game.js').Game;
var GameData = require('./gamedata.js').GameData;
var Recipient = require('./gamedata.js').Recipient;

var GameHost = exports.GameHost = function(){
    this.game = new Game();
    this.gamesData = this.generateGamesData([1000]);
};

GameHost.prototype.getGame = function(){
    return this.game;
};

GameHost.prototype.generateGamesData = function(steps){
    var gamesData = [];

    steps.forEach(function(step){
        var data = gamesData['step-' + step] = {
            recipients: []
        };

        for(var i=0;i<step;++i){
            data.recipients.push(new Recipient(i, "John Doe", "john_"+i+"imgonnabounce.com", {}));
        }

        gamesData.push(data);
    });

    return gamesData;
};

GameHost.prototype.start = function(playerName){
    var outerScope = this;

    var players = playerName == null ?
        outerScope.game.getAvailablePlayers() : [playerName];

    players.forEach(function(playerName){
        var gamesData = outerScope.gamesData;
        var playerManifest = outerScope.game.getPlayerManifest(playerName);

        if(playerManifest){
            var player = outerScope.game.getPlayer(playerName);

            console.log("Running player: " + playerManifest.name);

            var executeGameQueue = function(){
                var data = gamesData.shift();

                console.log(" * Playing game with " + data.recipients.length + " recipients");

                outerScope.game.run(player, new GameData(data.recipients), function(error, result){
                    console.log(result);
                    if(gamesData.length > 0){
                        executeGameQueue();
                    }
                });
            };

            executeGameQueue();
        }else{
            console.log("Player with name '" + playerName + "' does not exist");
        }
    });
};

exports.create = function(){
    return new GameHost();
};