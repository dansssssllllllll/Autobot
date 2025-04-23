const cron = require('node-cron');
const axios = require('axios');
const {
    OnChat,
    font
} = require('chatbox-utility');

module.exports["config"] = {
    name: "autopost",
    version: "1.0.0",
    credits: "aminul", // warning dont change
};

let isCronStarted = false;

const greetings = {
    morning: [
        "Good morning! Have a great day!",
        "Rise and shine! Good morning!",
        "Morning! Hope you have an amazing day!",
        "Gising na kayo umaga na!",
    ],
    afternoon: [
        "Good afternoon! Keep up the great work!",
        "Afternoon! Hope you're having a wonderful day!",
        "Hello! Wishing you a pleasant afternoon!",
        "Time to eat something!",
        "Maayong udto mga ril nigas pangaon namo!",
    ],
    evening: [
        "Good evening! Relax and enjoy your evening!",
        "Evening! Hope you had a productive day!",
        "Hello! Have a peaceful and enjoyable evening!",
    ],
    night: [
        "Good night! Rest well!",
        "Night! Sweet dreams!",
        "Hello! Wishing you a restful night!",
        "Tulog na kayo!",
    ]
};

// Function to get a random greeting based on the time of day
function greetRandom(timeOfDay) {
    const messages = greetings[timeOfDay];
    return messages[Math.floor(Math.random() * messages.length)];
}

async function motivation(chat) {
    try {
        console.log('Posting Motivational quotes...');
        const response = await axios.get("https://raw.githubusercontent.com/JamesFT/Database-Quotes-JSON/master/quotes.json");
        const quotes = response.data;

        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];

        const quote = `"${randomQuote.quoteText}"\n\n— ${randomQuote.quoteAuthor || "Kenneth Panio"}`;
        await chat.post(font.thin(quote)); // Ensure you await the post
    } catch (error) {
        console.error('Error fetching or posting the motivational quote:', error);
    }
}

async function greetThreads(chat, timeOfDay) {
    try {
        console.log(`Sending ${timeOfDay} greetings...`);
        const msgTxt = greetRandom(timeOfDay);
        const threads = await chat.threadList(10, null, ['INBOX']);

        if (!threads || threads.length === 0) {
            console.log('No threads found.');
            return;
        }

        for (const thread of threads) {
            if (thread.isGroup) {
                await chat.reply(font.thin(msgTxt), thread.threadID);
            }
        }
    } catch (error) {
        console.error(`Error sending ${timeOfDay} greeting:`, error);
    }
}

const scheduleCronJobs = (chat, hours, timeOfDay) => {
    if (!Array.isArray(hours)) {
        console.error(`Error: Invalid hours array for ${timeOfDay}:`, hours);
        return;
    }
    hours.forEach(hour => {
        cron.schedule(`0 ${hour} * * *`, () => {
            console.log(`Scheduled ${timeOfDay} greetings at hour ${hour}`);
            greetThreads(chat, timeOfDay);
        }, {
            scheduled: true,
            timezone: 'Asia/Dhaka'
        });
    });
};

module.exports["handleEvent"] = async function ({
    api,
    event
}) {
    const chat = new OnChat(api, event);


    if (!isCronStarted) {
        isCronStarted = true;

        scheduleCronJobs(chat, [5, 6, 7], 'morning');
        scheduleCronJobs(chat, [12, 13], 'afternoon');
        scheduleCronJobs(chat, [18, 19, 20, 21], 'evening');
        scheduleCronJobs(chat, [22, 23], 'night');

        cron.schedule('*/50 * * * *', () => motivation(chat), {
            scheduled: true,
            timezone: 'Asia/Dhaka'
        });
    }
};
