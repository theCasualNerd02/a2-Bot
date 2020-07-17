// to do
//strip and set the high bits, set up named pipe to index.js, look into apple script for sending screenshots

const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const fs = require('fs');
const { strict } = require('assert');
const { isNull } = require('util');


function stripHighBit(output){

}

function setHighBit(input){
    
}

client.once('ready', () => {
    console.log('online');
    console.log(config.bot_info.name);
    console.log(config.bot_info.version);
});

client.login(config.token);

//input
    //get message
client.on('message', message => {
    if (message.content.startsWith(config.prefix) && !message.author.bot){ // waits for !a2 to be the start of a message it didn't send
        let input = message.toString();
        console.log(input)
        input = input.replace('!a2 ' , '');// removes the prefix before editing input to but put through virtual ][]
        input = input.replace('!a2' , '');//removes prefix if there is no space after the prefix
        setHighBit(input); //sets high bit so that text can be interpreted by the emulator

    }
    
}); 

//output
//need to move to be in client.on when code is functioning
//code below from https://stackoverflow.com/questions/5784621/how-to-read-binary-files-byte-by-byte-in-node-js
/*
fs.open(config["pipe-Name"], 'r', function(status, fd) {
    if (status) {
        console.log(status.message);
        return;
    } 
    var buffer = Buffer.alloc(100);
    fs.read(fd, buffer, 0, 100, 0, function(err, num) {
        console.log(buffer.toString('utf8', 0, num));
    });
});
var ch;
ch = //set to the bit being stripped
if (ch === '/r'){//convert the line feed to a character turn
    ch = '/n';
}
else {
    char |= 128; // 01000000 removes the set high bit so it can be read on modern systems
}
*/
