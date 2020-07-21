// to do
//make running disks work (goal is to play text adventure), make larger message not loose data, make ^c work, !a2 key, !a2 text, and other ideas

const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const fs = require('fs');
const { strict } = require('assert');
const { isNull } = require('util');
const { count } = require('console');

//innitalize inFd and outFd
var inFd;
var outputBuffer = Buffer.alloc(1024);
var numOutputBytes = 0;
var readStream;
var channel = null;
var outputString = '```';
var timeOutFlush;

function writeToPipe(inputBuffer){
    console.log(config["inPipe-Name"]);
    fs.write(inFd, inputBuffer, (err, bytesWritten, buffer) => {
        console.log(bytesWritten);
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
        else console.log('message is empty');
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
        console.log(buffer.join());
        for (counter = 0; counter < buffer.length; counter++){//for every char in the string
            var charCode = (buffer[counter] & 127);
            if (charCode == 7) {//code not entering if **
                console.log('BEEP detected');
                //charCode = 0b10001100011; // if the character is the beep noise replace it with the "bell" emoji
                outputString += String.fromCodePoint(0x1F514);
            }
            if(charCode == 0b1101){//0b1101 is 13 in binary which is the value for return/newline http://www.virtualii.com/VirtualIIHelp/virtual_II_help.html 
                console.log(outputString);
                if(channel == null){
                    console.log('channel is null');
                }
                else{
                    clearTimeout(timeOutFlush);
                    outputString += '```';
                    outputString = outputString.replace('``````', '');//if there are only ticks delete the contents
                    if (outputString != '') channel.send(outputString);
                    else console.log('message is empty');
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
            message.channel.send('- use the prefix !a2 followed by basic code to run the code through an apple ][ emulator');
            message.channel.send('- use k(command) to use a key not type-able through discord. Fill in command with one of esc, up, down, left, right.');
            message.channel.send('- use "!a2 ^c" to break the code in case of an infinite loop');
    }
    else if (message.content == '!a2 ^c'){
        input = String.fromCharCode(0b11);//input is equal to ^c
        var buffer = Buffer.alloc(1);
        buffer[0] = 131;
        writeToPipe(buffer);
        //bits are being send but the system isn't recignising it **
    }
    else if (message.content.startsWith(config.prefix) && !message.author.bot){ // waits for !a2 to be the start of a message it didn't send
        let input = message.toString();
        console.log(input)
        input = input.replace('!a2 ' , '');// removes the prefix before editing input to but put through virtual ][]
        input = input.replace('!a2' , '');//removes prefix if there is no space after the prefix
        input = input.replace('k(esc)', String.fromCharCode(0b11011));
        /*start of arrow key codes (currently abandoned)
        input = input.replace('k(up)', );
        input = input.replace('k(down)', );
        input = input.replace('k(left)', );
        input = input.replace('k(right)', );
        */
        setHighBit(input); //sets high bit so that text can be interpreted by the emulator

    }
    
}); 