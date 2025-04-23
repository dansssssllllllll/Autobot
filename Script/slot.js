const Database = require('../utils/database');
const db = new Database(path.join(__dirname, '../database'));

module.exports.config = {
  name: "slot",
  version: "1.0.0",
  credits: "Developer",
  permission: 0,
  description: "Play slot game",
  category: "Game",
  usages: "slot start <bet>",
  prefix: false,
  premium: false,
  cooldown: 0
};

module.exports.run = async function({ api, event, args }) {
  if (args[0] !== 'start' || args.length < 2) return api.sendMessage("Invalid usage. Please use slot start <bet>", event.threadID);

  const bet = parseInt(args[1]);
  if (isNaN(bet) || bet < 50 || bet > 10000000000000) return api.sendMessage("Invalid bet. Please bet between 50 and 10000000000000.", event.threadID);

  const userID = event.senderID;
  const balance = db.get(userID, 'coin_balances') || 0;
  if (balance < bet) return api.sendMessage("Insufficient balance.", event.threadID);

  db.set(userID, 'coin_balances', balance - bet);

  const slots = ['🟢', '🔵', '🔴'];
  const result1 = slots[Math.floor(Math.random() * slots.length)];
  const result2 = slots[Math.floor(Math.random() * slots.length)];
  const result3 = slots[Math.floor(Math.random() * slots.length)];

  let message = `${result1} | ${result2} | ${result3}\n`;
  let winnings = 0;

  if (result1 === result2 && result2 === result3) {
    winnings = bet * 10;
    message += `Jackpot! You won ${winnings}.`;
  } else if (result1 === result2 || result2 === result3 || result1 === result3) {
    winnings = bet * 2;
    message += `You won ${winnings}.`;
  } else {
    message += "Better luck next time.";
  }

  const newBalance = balance - bet + winnings;
  db.set(userID, 'coin_balances', newBalance);

  api.sendMessage(message + `\nNew balance: ${newBalance}`, event.threadID);
};