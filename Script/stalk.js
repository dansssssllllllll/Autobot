const axios = require("axios");
const fs = require("fs");
const request = require("request");
const path = require("path");

module.exports.config = {
    name: "stalk",
    version: "2.1.0",
    hasPermsion: 0,
    credits: "Deku (Modified)",
    description: "Get info using uid/mention/reply to a message",
    usages: "[reply/uid/@mention]",
    commandCategory: "info",
    usePrefix: false,
    cooldowns: 0
};

function convert(time) {
    const date = new Date(time);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year}||${hours}:${minutes}:${seconds}`;
}

const headers = {
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like) Version/12.0 AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1",
    "accept": "application/json, text/plain, */*"
};

module.exports.run = async function({ api, event, args }) {
    const token = "EAAD6V7...."; // Replace with your actual token (ideally, load it from an environment variable or config file)
    let id;

    if (args.join().indexOf('@') !== -1) {
        id = Object.keys(event.mentions)[0];
    } else if (event.type === "message_reply") {
        id = event.messageReply.senderID;
    } else {
        id = args[0] || event.senderID;
    }

    const filePath = path.join(__dirname, `/cache/info_${id}.png`); //Unique file name for each user.

    try {
        const resp = await axios.get(`https://graph.facebook.com/${id}?fields=id,is_verified,cover,created_time,work,hometown,username,link,name,locale,location,about,website,birthday,gender,relationship_status,significant_other,quotes,first_name,subscribers.summary{total_count}&access_token=${token}`, { headers });
        const data = resp.data;

        const name = data.name;
        const link_profile = data.link;
        const uid = data.id;
        const first_name = data.first_name;
        const username = data.username || "No data!";
        const created_time = convert(data.created_time);
        const web = data.website || "No data!";
        const gender = data.gender || "No data!";
        const relationship_status = data.relationship_status || "No data!";
        const love = data.significant_other ? data.significant_other.name : "No data!";
        const bday = data.birthday || "No data!";
        const follower = data.subscribers?.summary?.total_count || "No data!";
        const is_verified = data.is_verified;
        const quotes = data.quotes || "No data!";
        const about = data.about || "No data!";
        const locale = data.locale || "No data!";
        const hometown = data.hometown?.name || "No Hometown";
        const cover = data.cover?.source || "No Cover photo";
        const avatar = `https://graph.facebook.com/${id}/picture?width=1500&height=1500&access_token=${token}`;

        const callback = () => {
            api.sendMessage({
                body: `•——INFORMATION——•\nName: ${name}\nFirst name: ${first_name}\nCreation Date: ${created_time}\nProfile link: ${link_profile}\nGender: ${gender}\nRelationship Status: ${relationship_status}\nBirthday: ${bday}\nFollower(s): ${follower}\nHometown: ${hometown}\nLocale: ${locale}\n•——END——•`,
                attachment: fs.createReadStream(filePath)
            }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
        };

        request(encodeURI(avatar)).pipe(fs.createWriteStream(filePath)).on("close", callback);

    } catch (err) {
        api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
        console.error(err);
    }
};
