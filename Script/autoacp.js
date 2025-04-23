const moment = require("moment-timezone");

let autoAccept = true;

module.exports.config = {
  name: "autoaccept",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "Arjhil",
  description: "Make friends via Facebook ID",
  commandCategory: "admin",
  usages: "uid",
  cooldowns: 0
};

module.exports.run = async ({ event, api }) => {
  const form = {
    av: api.getCurrentUserID(),
    fb_api_req_friendly_name: "FriendingCometFriendRequestsRootQueryRelayPreloader",
    fb_api_caller_class: "RelayModern",
    doc_id: "4499164963466303",
    variables: JSON.stringify({ input: { scale: 3 } })
  };
  const listRequest = JSON.parse(await api.httpPost("https://www.facebook.com/api/graphql/", form)).data.viewer.friending_possibilities.edges;

  const args = event.body.split(" ");
  if (args.length >= 2) {
    if (args[1].toLowerCase() === "on") {
      autoAccept = true;
      return api.sendMessage("Auto-accept is now turned on.", event.threadID);
    } else if (args[1].toLowerCase() === "off") {
      autoAccept = false;
      return api.sendMessage("Auto-accept is now turned off.", event.threadID);
    }
  }

  if (autoAccept) {
    // Implement auto-accept logic here
    const success = [];
    const failed = [];

    for (const user of listRequest) {
      const u = user.node;
      form.fb_api_req_friendly_name = "FriendingCometFriendRequestConfirmMutation";
      form.doc_id = "3147613905362928";
      form.variables.input.friend_requester_id = u.id;
      form.variables = JSON.stringify(form.variables);

      try {
        const friendRequest = await api.httpPost("https://www.facebook.com/api/graphql/", form);
        if (!JSON.parse(friendRequest).errors) {
          success.push(u.name);
        }
      } catch (e) {
        failed.push(u.name);
      }

      form.variables = JSON.parse(form.variables);
    }

    api.sendMessage(`Auto-accepted ${success.length} friend requests:\n${success.join("\n")}${failed.length > 0 ? `\nFailed to accept with ${failed.length} person: ${failed.join("\n")}` : ""}`, event.threadID);
  } else {
    api.sendMessage("Auto-accept is currently turned off.", event.threadID);
  }
};
      
