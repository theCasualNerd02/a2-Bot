// to do
//make the bot able to send the output to discord properally, make sending new lines from discord to the apple ][ work, look into apple script for sending screenshots and other ideas

const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const fs = require('fs');
const { strict } = require('assert');
const { isNull } = require('util');

//innitalize inFd and outFd
var inFd;
var outputBuffer = Buffer.alloc(1024);
var numOutputBytes = 0;
var readStream;
var channel = null;
var outputString = '';

function setHighBit(input){
    var counter;
    if (input[input.length-1] != '\r' && input[input.length-1] != '\n'){
        input += '\r';
    }
    for (counter = 0; counter < input.length; counter++){//for every char in the string
        if (input[counter] === '\n'){//convert the newline to carriage turn
            input[counter] = 0b1101;
        }
        input[counter] |= 128; // 01000000 removes the set high bit so it can be read on modern systems
    }
    
    console.log(config["inPipe-Name"]);
    fs.write(inFd, input, (err, bytesWritten, buffer) => {
        console.log(bytesWritten);
    })
    
}
/*
function readOutput(){
    var output;
    console.log('hi');
    
    return;
    fs.open(config["outPipe-Name"], 'r', (err, outFd) => {//r is read, make this open sync
        while(fs.readSync(outFd, outputBuffer, numOutputBytes, 1, null) == 1){//make read sync non block
            buffer[numOutputBytes] &= 127;
            if(buffer[numOutputBytes] == '\r') {
                client.send(outputBuffer.toString('utf8', 0, numOutputBytes));//this is the attempt to send the messages to discord
                numOutputBytes = 0;
            }
            else numOutputBytes++;
        }

    })
}
*/

client.once('ready', () => {
    console.log('online');
    console.log(config.bot_info.name);
    console.log(config.bot_info.version);
    //set fds
    inFd = fs.openSync(config["inPipe-Name"], 'a+');
    readStream = fs.createReadStream(config["outPipe-Name"]);
    readStream.on('data', buffer => {
        var counter;
        for (counter = 0; counter < buffer.length; counter++){//for every char in the string
            buffer[counter] &= 127;
            if(buffer[counter] == 0b1101){//0b1101 is 13 in binary which is the value for return/newline http://www.virtualii.com/VirtualIIHelp/virtual_II_help.html 
                console.log(outputString);
                if(channel == null){
                    console.log('channel is null');
                }
                else if(outputString == '') console.log('message is empty');
                else{
                    channel.send(outputString);
                    outputString = '';
                }
                

            }
            else{
                outputString += String.fromCharCode(buffer[counter]);
            }
        }
        
    })
});


client.login(config.token);
//gets message and sends it to set the high bit
client.on('message', message => {
    channel = message.channel;
    if (message.content == '!a2 help'){
            message.channel.send('use "!a2 help" to display this message, use the prefix !a2 followed by basic code to run the code through an apple ][ emulator.')
    }
    else if (message.content.startsWith(config.prefix) && !message.author.bot){ // waits for !a2 to be the start of a message it didn't send
        let input = message.toString();
        console.log(input)
        input = input.replace('!a2 ' , '');// removes the prefix before editing input to but put through virtual ][]
        input = input.replace('!a2' , '');//removes prefix if there is no space after the prefix
        setHighBit(input); //sets high bit so that text can be interpreted by the emulator

    }
    
}); 