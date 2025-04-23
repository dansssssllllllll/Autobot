const axios = require("axios");

module.exports.config = {
  name: "sim",
  version: "1.0.0",
  role: 0,
  aliases: ["Sim"],
  credits: "jerome",
  description: "Talk to sim",
  cooldown: 0,
  hasPrefix: false
};

module.exports.run = async function({ api, event, args }) {
  const reply = event.body.trim();
  console.log(`🔍 User asked: ${reply}`); // Debugging log

  // Define API URL
  const apiUrl = "https://jan-40wx.onrender.com";

  // Fetch the total number of questions learned
  async function fetchCount() {
    try {
      const response = await axios.get(`${apiUrl}/count`);
      console.log("🔍 Fetched Question Count:", response.data.count); // Debugging log
      return response.data.count;
    } catch (error) {
      console.error("❌ Error fetching count:", error.message);
      return 0;
    }
  }

  // Get the answer for a given question
  async function getAnswer(question) {
    try {
      const response = await axios.get(`${apiUrl}/answer/${encodeURIComponent(question)}`);
      console.log("🔍 API Response:", response.data); // Debugging log

      if (response.data && response.data.answer) {
        return response.data.answer;
      } else {
        return "I haven't learned this yet, please teach me 👀";
      }
    } catch (error) {
      console.error("❌ Error fetching answer:", error.message);
      return "❌ please teach me sir!";
    }
  }

  // Add a question-answer pair to the bot
  async function addQuestionAnswer(question, answer) {
    try {
      const response = await axios.post(`${apiUrl}/add`, { question, answer });
      console.log("🔍 Response from adding question-answer:", response.data); // Debugging log
      return response.data.message;
    } catch (error) {
      console.error("❌ Error adding Q&A:", error.message);
      return "❌ Failed to teach!";
    }
  }

  // Command logic
  if (args.length < 1) {
    return api.sendMessage("❌ Please ask a question!", event.threadID, event.messageID);
  }

  const command = args[0].toLowerCase();
  console.log(`🔍 Command received: ${command}`); // Debugging log

  // If the user asks for the question count
  if (command === "count") {
    const count = await fetchCount();
    return api.sendMessage(`Dear, I have learned ${count} questions so far. 📊`, event.threadID, event.messageID);
  }

  // If the user wants to add a new question-answer pair
  if (command === "add") {
    const input = args.slice(1).join(" ").split(" - ");
    if (input.length !== 2) {
      return api.sendMessage("❌ Please use the correct format: /sim add <question> - <answer>", event.threadID, event.messageID);
    }

    const question = input[0].trim();
    const answer = input[1].trim();
    const responseMessage = await addQuestionAnswer(question, answer);
    return api.sendMessage(responseMessage, event.threadID, event.messageID);
  }

  // Otherwise, attempt to fetch an answer for the question
  const input = args.join(" ").trim();
  const responseMessage = await getAnswer(input);

  await api.sendMessage(responseMessage, event.threadID, (error, info) => {
    if (error) {
      console.error("❌ Error sending reply:", error.message);
      return;
    }
    global.GoatBot.onReply.set(info.messageID, {
      commandName: this.config.name,
      type: "reply",
      messageID: info.messageID,
      author: event.senderID
    });
  }, event.messageID);
};
