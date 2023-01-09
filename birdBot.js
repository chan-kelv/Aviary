require('dotenv').config()
const tmi = require('tmi.js');

// Define configuration options
const opts = {
  identity: {
    username: process.env.TWITCH_BOT_USERNAME,
    password: process.env.TWITCH_OAUTH_TOKEN // OAUTH User Token currently from CLI TODO figure out how to do it in code
  },
  channels: [
    'HydroSparKs'
  ],
  connection: {
    reconnect: true
  }
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (channel, tags, message, self) {
  console.log(`message from ${channel} tag:${tags} msg: "${message}" isSelf:${self}`)
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = message.trim();

  // If the command is known, let's execute it
  if (commandName === '!dice') {
    const num = rollDice();
    client.say(channel, `You rolled a ${num}`);
    console.log(`* Executed ${commandName} command target:${tags} ${channel} ${message} ${self}`);
  } else if(commandName === '!birdFact'){
    client.say(channel, 'Bird Fact!')
  } else {
    console.log(`* Unknown command ${commandName}`);
  }
}

// Function called when the "dice" command is issued
function rollDice () {
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}