var microtime = require('microtime');

var GameStatus = exports.GameStatus = {
    Started: 0,
    Sent: 1,
    Recieved: 2,
    Ended: 3
};

var Judge = exports.Judge = function(player, gameData, callback){
    this.callback = callback || function(){};
    this.player = player;
    this.gameData = gameData;
    this.results = {};
    this.started = null;
    this.timeout = null;
};

Judge.prototype.startGame = function(){
    if(this.started === null){
        this.report(GameStatus.Started);
        this.player.play(this, this.gameData);
    }else{
        this.callback("Game already started");
    }
};

Judge.prototype.report = function(status){
    var outerScope = this;
    switch(status){
        case GameStatus.Started:
            this.started = microtime.now();
            this.results[status] = 0;
            break;
        case GameStatus.Sent:
            clearTimeout(this.timeout);
            this.timeout = setTimeout(function(){
                outerScope.reportEnded();
            }, 5000);
        default:
            this.results[status] = microtime.now()-this.started;
            if(status == GameStatus.Ended){
                clearTimeout(this.timeout);
                this.player.stop();
                this.callback(false, this.getResults());
            }
            break;
    }
};

Judge.prototype.reportSent = function(){
    this.report(GameStatus.Sent);
};

Judge.prototype.reportRecieved = function(){
    this.report(GameStatus.Recieved);
};

Judge.prototype.reportEnded = function(){
    this.report(GameStatus.Ended);
};

Judge.prototype.getResults = function(){
    return this.results;
};