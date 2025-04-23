Here's the updated code without the auto chat feature:


const cron = require('node-cron');
const { OnChat } = require('chatbox-utility');

module.exports["config"] = {
  name: "autoleave",
  version: "1.0.0",
  credits: "Developer",
};

let warnedGroups = {};

module.exports["handleEvent"] = async function ({ api, event }) {
  const chat = new OnChat(api, event);
  const botID = api.getCurrentUserID();
  const ownerID = "61554405703021";

  if (event.logMessageType === "log:subscribe") {
    if (event.logMessageData.addedParticipants.some(p => p.userFbId === botID)) {
      const threadID = event.threadID;
      await chat.reply("pls... Add my owner facebook.com/61554405703021 or else bot well leave for 5 mins", threadID);
      warnedGroups[threadID] = Date.now();
      setTimeout(async () => {
        const threadInfo = await api.getThreadInfo(threadID);
        if (threadInfo.participantIDs.includes(ownerID)) return;
        await api.sendMessage("Time's up! Leaving group chat.", threadID);
        await api.removeUserFromGroup(botID, threadID);
      }, 300000); 
    }
  }

  if (event.logMessageType === "log:unsubscribe") {
    if (event.logMessageData.leftParticipantFbId === ownerID) {
      const threadID = event.threadID;
      await api.sendMessage("My owner has left the group. Leaving group chat.", threadID);
      await api.removeUserFromGroup(botID, threadID);
    }
  }
};
