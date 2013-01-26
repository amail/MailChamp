var program = require('commander');
var host = require('./core/gamehost.js').create();

program
    .version('0.4.00');

program
    .command('players')
    .description('Get a list of all available players')
    .action(function(){
        var playerOffset = 0;
        console.log("Available players:");

        var game = host.getGame();
        game.getAvailablePlayers().forEach(function(playerName){
            var playerManifest = game.getPlayerManifest(playerName);
            console.log(" "+ (++playerOffset) + ") " + playerManifest.name + ") " + playerManifest.description);
        });
    });

program
    .command('run [player_name]')
    .description('Run a game with one or all players')
    .action(function(playerName, options){
        host.start(playerName);
    });

program
    .command('config [player_name]')
    .description('Get the configuration for a specific player')
    .action(function(playerName){
        if(playerName){
            var playerConfig = host.getGame().getPlayerConfig(playerName);
            if(playerConfig){
                var playerManifest = host.getGame().getPlayerManifest(playerName);
                console.log("Showing configuration variables for " + playerManifest.name + ":");
                console.log(JSON.stringify(playerConfig, null, 4));
            }else{
                console.log("Invalid player name '" + playerName + "'");
            }
        }else{
            console.log("Please provide a player name");
        }
    });

program
    .command('*')
    .action(function(playerName, options){
        program.help();
    });

program
    .parse(process.argv);

if (!program.args.length){
    program.help();
}