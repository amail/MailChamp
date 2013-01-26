var Recipient = exports.Recipient = function(id, name, email, data){
    this.id = id;
    this.name = name;
    this.email = email;
    this.data = data;
};

Recipient.prototype.getId = function(){
    return this.id;
};

Recipient.prototype.getName = function(){
    return this.name;
};

Recipient.prototype.getEmail = function(){
    return this.email;
};

Recipient.prototype.getData = function(){
    return this.data;
};

var GameData = exports.GameData = function(recipients){
    this.recipients = recipients || [];
};

GameData.prototype.getRecipients = function(){
    return this.recipients;
};