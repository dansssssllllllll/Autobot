const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { DateTime } = require("luxon");

module.exports.config = {
  name: "blackbox",
  version: "2.0.0",
  role: 0,
  aliases: ['box', 'python']
};

module.exports.run = async function ({ api, event, args }) {
  let { messageID, threadID, senderID } = event;
  const query = args.join(" ");

  if (!query) {
    api.sendMessage("❔ | Please Provide Input...", threadID, messageID);
    return;
  }

  try {
    api.setMessageReaction("🕣", messageID, () => {}, true);
    api.sendMessage("🕣 | 𝘈𝘯𝘴𝘸𝘦𝘳𝘪𝘯𝘨....", threadID, messageID);

    // Box API for AI responses
    const boxUrl = 'https://useblackbox.io/chat-request-v4';
    const boxData = {
      textInput: query,
      allMessages: [{ user: query }],
      stream: '',
      clickedContinue: false,
    };
    const boxResponse = await axios.post(boxUrl, boxData);
    const answer = boxResponse.data.response[0][0] || 'No Answers Found';
    const manilaTime = DateTime.now().setZone("Asia/Manila").toFormat("yyyy-MM-dd hh:mm:ss a");

    // Send AI response text
    const formattedResponse = `${answer}`;
    api.sendMessage(formattedResponse, threadID, messageID);

    // Mrbeast Voice
    const beastUrl = 'https://www.api.vyturex.com/beast';
    try {
      const beastResponse = await axios.get(`${beastUrl}?query=${encodeURIComponent(answer)}`);
      if (beastResponse.data && beastResponse.data.audio) {
        const audioURL = beastResponse.data.audio;
        const fileName = "mrbeast_voice.mp3"; 
        const filePath = path.resolve(__dirname, 'cache', fileName);

        const { data: audioData } = await axios.get(audioURL, { responseType: 'arraybuffer' });
        fs.writeFileSync(filePath, audioData);

        api.sendMessage({
          body: "💽 𝗩𝗼𝗶𝗰𝗲",
          attachment: fs.createReadStream(filePath)
        }, threadID, async (voiceError) => {
          if (voiceError) {
            console.error('Error sending voice response:', voiceError);
          }

          fs.unlinkSync(filePath); // Remove the temporary voice file
        });
      } else {
        console.error("Failed to fetch Beast API response.");
      }
    } catch (beastError) {
      console.error('Error during Beast API request:', beastError);
    }
  } catch (error) {
    api.sendMessage(error.message, threadID, messageID);
  }
};
