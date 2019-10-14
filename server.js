const express = require("express");
const mqpAPI = require('musiqpadmqp-api'); 
const app = express();
var meh = 0;
var grab = 0;
var woot = 0;
var botname = "MQP_BOT";
var roomname = "Official MP DEV server";

var bot = new mqpAPI({
  autoreconnect: true,     // Enabled by default, for other options check the wiki
  logging: {
    logLevel: 'info',      // Default is info, others are:
                           // silent, error, warn, info, verbose, debug, silly
    logFile: './logs.json' // Optional
  }
});

bot.connect({
 // useSSL: true,
  socketDomain: 'devmqp.glitch.me',
  socketPort: 80,
// if u use heroku for ur pad u dont need to use port 
}).then(() => {
  return bot.login({
    email: 'mail',
    password: 'pass',
  });
}).then(() => {
  console.log('Logged in!');
})

// Add an event Listener for Chatevents
bot.on('chat', (data) => {
  if (data.msg.indexOf('@' + botname) != -1)
    bot.sendPrivateMessage(data.user.uid, 'Hey, ' + data.user.un + '! \
    To check all of my commands, type "!help".');


  if (data.msg.indexOf('!help') != -1) {
    bot.getRoomInfo().then(function (roomInfos) {
      bot.sendMessage("I can't help you. But I can give you \
      some Infos about the room: There are currently " +
      (Object.keys(bot.users).length + 1) + ' Users connected and ' + roomInfos.queue + ' users in the Queue');
    });
  }
});

bot.on('userJoined', function (data) {
  if (data.user)
    setTimeout(function () {
      bot.sendMessage('Welcome to ' + roomname, ' @' + data.user.un + ' !');
    }, 1000);
});

bot.on("voteUpdate", function(data) {
    woot = data.votes.like;
    grab = data.votes.grab;
    meh = data.votes.dislike;
});

bot.on("advance", function(data) {
  bot.vote("like");
  bot.sendMessage("Stats for " + bot.getMedia().title + " :thumbsup: " + woot + " :thumbsdown: " + meh + " :star: " + grab);
  woot = 0;
  grab = 0;
  meh = 0;
});

bot.on('privateMessage', function (data) {
  if (data.message.indexOf('help') != -1)
    bot.sendPrivateMessage(data.uid, 'Hey, ' + bot.users[data.uid].un + '! To check all of my commands, type "!help".');
});


const listener = app.listen(process.env.PORT, function() {
  console.log("BOT IS ONLINE " + listener.address().port);
});
