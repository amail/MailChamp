var alphamail = require('alphamail');

var Player = exports.Player = function(config){
    this.config = config;
    this.stopIssued = false;
    this.service = new alphamail.EmailService(config.api_token);
};

Player.prototype.play = function(judge, gameData){
    var outerScope = this;
    var totalReceived = 0;

    gameData.recipients.forEach(function(recipient){
        var message = {};
        
        // Stop if this requested to stop
        if(outerScope.stopIssued){
            return;
        }
        
        var payload = new alphamail.EmailMessagePayload()
            .setProjectId(outerScope.config.project_id)
            .setSender(new alphamail.EmailContact("AlphaMail", "@alphamail.com"))
            .setReceiver(new alphamail.EmailContact(recipient.getName(), recipient.getEmail()))
            .setBodyObject(message);

        judge.reportSent();
        outerScope.service.queue(payload, function(error, result){
            // Stop if this requested to stop
            if(outerScope.stopIssued){
                return;
            }

            judge.reportRecieved();

            if(++totalReceived == gameData.recipients.length){
                judge.reportEnded();
            }
        });

    });
};

// Game ended.. All executions should stop
Player.prototype.stop = function(){
    this.stopIssued = true;
};