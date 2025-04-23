const axios = require('axios');

module.exports.config = {
  name: 'waifu-bot',
  version: '1.0.2',
};

module.exports.handleEvent = async function ({ api, event }) {
  const categories = ['waifu', 'neko', 'shinobu', 'megumin', 'bully', 'cuddle', 'cry', 'hug', 'awoo', 'kiss', 'lick', 'pat', 'smug', 'bonk', 'yeet', 'blush', 'smile', 'wave', 'highfive', 'handhold', 'nom', 'bite', 'glomp', 'slap', 'kill', 'kick', 'happy', 'wink', 'poke', 'dance', 'cringe'];
  
  const lowercasedBody = event.body ? event.body.toLowerCase() : '';

  // Check if the message contains any of the specified categories
  const matchedCategory = categories.find(category => lowercasedBody.includes(category));

  if (matchedCategory) {
    try {
      const response = await axios.get(`https://api.waifu.pics/sfw/${matchedCategory}`);
      const imageUrl = response.data.url;
      const options = { responseType: 'stream' };
      const imageResponse = await axios.get(imageUrl, options);
      const attachment = { attachment: imageResponse.data };

      // Send the waifu picture as a reaction
      api.sendMessage(attachment, event.threadID);
    } catch (error) {
      console.error('Error fetching waifu picture:', error);
    }
  }
};
