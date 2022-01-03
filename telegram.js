const request = require('request');
const ip = require('ip');
const TelegramBot = require('node-telegram-bot-api');

const fs = require('fs');

const token = fs.readFileSync(__dirname + '/token.txt', 'utf8');

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];

  bot.sendMessage(chatId, resp);
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  request.get({ url: 'https://api.ipify.org' }, function (_1, _2, body) {
    bot.sendMessage(chatId, 'Public IP address > ' + body + '\nVirtual IP address > ' + ip.address());
  });
});
