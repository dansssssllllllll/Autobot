module.exports = {
  akane: {
    name: "gemini",
    permission: 0,
    author: "Deku", //https://facebook.com/joshg101
    description: "Talk to Gemini (conversational)",
    prefix: false,
    category: "AI",
  },
  start: async function ({ event, text, reply, react }) {
    const axios = require("axios");
    let prompt = text.join(" "),
      uid = event.senderID,
      url;
    if (!prompt) return reply(`Please enter a prompt.`);
    react('✍️');
    try {
      const api = `https://gemini-api.replit.app`;
      if (event.type == "message_reply"){
        if (event.messageReply.attachments[0]?.type == "photo"){
        url = encodeURIComponent(event.messageReply.attachments[0].url);
        const res = (await axios.get(api + "/gemini?prompt="+prompt+"&url="+url+"&uid="+uid)).data;
        return reply(res.gemini)
        } else {
          return reply('Please reply to an image.')
        }
      }
      const rest = (await axios.get(api + "/gemini?prompt=" + prompt + "&uid=" + uid)).data;
      return reply(rest.gemini)
    } catch (e) {
      console.log(e);
      return reply(e.message);
    } //end of catch
  }, // end of start
}; // end of exports
