const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: 'teach',
    version: '1.1.0',
    role: 0,
    description: "Teach the bot to respond like a person (locally)",
    usage: "teach [question] | [answer]",
    credits: 'Developer',
    cooldown: 3,
};

const knowledgeFilePath = path.join(__dirname, "knowledge.json"); // Store knowledge in a JSON file

// Function to load the knowledge base
function loadKnowledge() {
    try {
        const data = fs.readFileSync(knowledgeFilePath, "utf8");
        return JSON.parse(data);
    } catch (error) {
        return {}; // Return empty object if file doesn't exist or is invalid
    }
}

// Function to save the knowledge base
function saveKnowledge(knowledge) {
    fs.writeFileSync(knowledgeFilePath, JSON.stringify(knowledge, null, 2), "utf8");
}

module.exports.run = async function({ api, event, args }) {
    let { messageID, threadID } = event;
    const input = args.join(" ").split("|");

    if (input.length < 2) {
        if(args.length == 0){
            return api.sendMessage("Usage: teach [question] | [answer]", threadID, messageID);
        } else if(args.join(" ").includes("|")) {
            return api.sendMessage("Please provide both a question and an answer.", threadID, messageID);
        } else {
            return api.sendMessage("Please use '|' character to separate the question and answer.", threadID, messageID);
        }
    }

    const question = input[0].trim().toLowerCase(); // Convert to lowercase for easier matching
    const answer = input[1].trim();

    const knowledge = loadKnowledge();
    knowledge[question] = answer;
    saveKnowledge(knowledge);

    api.sendMessage(`Successfully taught. Question: ${input[0].trim()} | Answer: ${input[1].trim()}`, threadID, messageID);
};
