const axios = require('axios');
const path = require('path');
const fs = require('fs-extra');


module.exports.config = {
    name: "shoti",
    version: "1.0.0",
    permission: 0,
    description: "random video from Shoti API By Lib API",
    prefix: false,
    premium: false,
    credits: "Jonell Magallanes",
    cooldowns: 10,
    category: "media"
};

module.exports.run = async function ({ api, event }) {
    try {
        const response = await axios.get('https://kaiz-apis.gleeze.com/api/shoti');
        const data = response.data.shoti;
        const fileName = `${event.messageID}.mp4`;
        const filePath = path.join(__dirname, fileName);
        
            const { videoUrl, title, username, nickname, region } = data;

            const downloadResponse = await axios({
            method: 'GET',
            url: videoUrl,
            responseType: 'stream',
        });
        const writer = fs.createWriteStream(filePath);
        downloadResponse.data.pipe(writer);
        writer.on('finish', async () => {
            api.sendMessage({
                body: `title : ${title}\nusername : ${username}\nnickname: ${nickname}\nregion : ${region}\n`,
                attachment: fs.createReadStream(filePath)
            }, event.threadID, () => {
                fs.unlinkSync(filePath);
            }, event.messageID);
        });
        writer.on('error', () => {
            api.sendMessage('There was an error downloading the file. Please try again later.', event.threadID, event.messageID);
        })
        

    } catch (error) {
        console.error('Error fetching video:', error);
        api.sendMessage(error.message, event.threadID, event.messageID);
    }
};