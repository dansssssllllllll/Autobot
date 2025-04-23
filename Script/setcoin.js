const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "setcoin",
  version: "1.0.0",
  credits: "Developer",
  permission: 2,
  description: "Set user's coin balance",
  category: "Admin",
  usages: "setcoin <uid> <amount>",
  prefix: false,
  premium: false,
  cooldown: 0
};

module.exports.run = async function({ api, event, args }) {
  if (args.length < 2) return api.sendMessage("Invalid usage. Please use setcoin <uid> <amount>", event.threadID);

  const userID = args[0];
  const amount = parseInt(args[1]);

  if (isNaN(amount)) return api.sendMessage("Invalid amount.", event.threadID);

  const coinBalanceDir = path.join(__dirname, '../database/coin_balances');
  const coinBalanceFile = path.join(coinBalanceDir, `${userID}.json`);

  if (!fs.existsSync(coinBalanceDir)) {
    fs.mkdirSync(coinBalanceDir, { recursive: true });
  }

  fs.writeFileSync(coinBalanceFile, JSON.stringify(amount));
  api.sendMessage(`Set ${userID}'s coin balance to ${amount}.`, event.threadID);
};