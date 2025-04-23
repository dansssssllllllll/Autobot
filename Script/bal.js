const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "bal",
  version: "1.0.0",
  credits: "Developer",
  permission: 0,
  description: "Check user's coin balance",
  category: "General",
  usages: "bal",
  prefix: false,
  premium: false,
  cooldown: 0
};

module.exports.run = async function({ api, event }) {
  const userID = event.senderID;
  const coinBalanceDir = path.join(__dirname, '../database/coin_balances');
  const coinBalanceFile = path.join(coinBalanceDir, `${userID}.json`);

  if (!fs.existsSync(coinBalanceDir)) {
    fs.mkdirSync(coinBalanceDir, { recursive: true });
  }

  let balance = 0;
  if (fs.existsSync(coinBalanceFile)) {
    balance = JSON.parse(fs.readFileSync(coinBalanceFile, 'utf8'));
  }

  api.sendMessage(`balance mo po ay: ${balance}`, event.threadID);
};