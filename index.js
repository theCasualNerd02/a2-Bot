//A2-Bot
//Written by Matthew Rand
//From Rand-dom Software
// to do
//edit an eamon game to work through this code

const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const fs = require('fs');
const { strict } = require('assert');
const { isNull } = require('util');
const { count } = require('console');

var inFd;
var outputBuffer = Buffer.alloc(1024);
var numOutputBytes = 0;
var readStream;
var channel = null;
var outputString = '```';
var timeOutFlush;

function writeToPipe(inputBuffer){
    fs.write(inFd, inputBuffer, (err, bytesWritten, buffer) => {
        fs.fsync(inFd, () => {});
    })
}
// function from https://www.sitepoint.com/delay-sleep-pause-wait/ 
function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

function setHighBit(input){
    var counter;

    if (input[input.length-1] != '\r' && input[input.length-1] != '\n'){
        input += '\r';
    }

    var inputBuffer = Buffer.alloc(1)
    for (counter = 0; counter < input.length; counter++){//for every char in the string
        if (input[counter] == '\n'){//convert the newline to carriage turn.
            inputBuffer[0] = (13 | 128);
        }
        else{
            inputBuffer[0] = (input.charCodeAt(counter) | 128);
        }
        writeToPipe(inputBuffer);
        sleep(50);
    }
    
}

function flushOutput(){
    if(channel == null){
        console.log('channel is null');
    }
    else{
        outputString += '```';
        outputString = outputString.replace('``````', '');//if there are only ticks delete the contents
        if (outputString != '') channel.send(outputString);
        outputString = '';
        outputString += '```';
    }
}

client.once('ready', () => {
    console.log('online');
    console.log(config.bot_info.name);
    console.log(config.bot_info.version);
    client.user.setActivity('type "!a2 help" for more info');
    inFd = fs.openSync(config["inPipe-Name"], 'a+');
    readStream = fs.createReadStream(config["outPipe-Name"]);
    readStream.on('data', buffer => {
        var counter;
        for (counter = 0; counter < buffer.length; counter++){//for every char in the string
            var charCode = (buffer[counter] & 127);
            if (charCode == 7) {//code not entering if **
                //charCode = 0b10001100011; // if the character is the beep noise replace it with the "bell" emoji
                outputString += String.fromCodePoint(0x1F514);
            }
            if(charCode == 0b1101){//0b1101 is 13 in binary which is the value for return/newline
                if(channel == null){
                    console.log('channel is null');
                }
                else{
                    clearTimeout(timeOutFlush);
                    outputString += '```';
                    outputString = outputString.replace('``````', '');//if there are only ticks delete the contents
                    if (outputString != '') channel.send(outputString);
                    outputString = '';
                    outputString += '```';
                }
                

            }
            else{
                timeOutFlush = setTimeout(flushOutput, 5000);// if no lines are sent in 2 seconds call this function
                outputString += String.fromCharCode(charCode);
            }
        }
        
    })
});


client.login(config.token);
//gets message and sends it to set the high bit
client.on('message', message => {
    channel = message.channel;
    if (message.content == '!a2 help'){
            message.channel.send('- use "!a2 help" to display this message');
            message.channel.send('- use "!a2 type " followed by basic commands to run that message through an apple ][');
            message.channel.send('- use "!a2 char " followed by a single character to send only that character to the apple ][');
            message.channel.send('warning: it is not possible to send ^c through a super serial card so please try to avoid causing an unbreakable infinite loop');
            message.channel.send('In the event of an infinite loop contact the controler of the emulator or apple ][ for them to break the loop and contact a mod to mute the bot if it is sending continual messages')
            message.channel.send('use "!a2 type pr#6" to play a game of The Wounderful World Of Eamon');
    }
    else if (message.content.startsWith(config.prefix + ' type ') && !message.author.bot){ // waits for !a2 type to be the start of a message it didn't send
        let input = message.toString();
        input = input.replace('!a2 type ' , '');// removes the prefix before editing input to but put through virtual ][
        setHighBit(input); //sets high bit so that text can be interpreted by the emulator

    }
    else if (message.content.startsWith(config.prefix + ' char ') && !message.author.bot){
        let input = message.toString();
        var inputBuffer = Buffer.alloc(1);
        input = input.replace(config.prefix + ' char ', '');
        inputBuffer[0] = (input.charCodeAt(0) | 128);//inputBuffer is equal to the character set with the high bit set
        writeToPipe(inputBuffer);
    }
}); 