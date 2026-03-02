const axios = require("axios");

module.exports = {
    config: {
        name: "caption",
        aliases: ["cp", "status", "ক্যাপশন"],
        version: "3.1.0",
        author: "TawHid_Bbz",
        countDown: 5,
        role: 0,
        description: {
            bn: "AI ব্যবহার করে সরাসরি ক্যাপশন পান",
            en: "Get direct captions using AI"
        },
        category: "fun",
        guide: {
            bn: '{pn} <কি ধরণের ক্যাপশন চাও>'
        }
    },

    onStart: async function ({ api, event, args, message }) {
        const { threadID, messageID } = event;
        const prompt = args.join(" ");

        if (!prompt) return message.reply("⚠️ আরে সোনা, কি নিয়ে ক্যাপশন চাও সেটা তো বললে না! 🙄");

        try {
            // এপিআই থেকে ক্যাপশন আনা
            const res = await axios.get(`https://sensui-useless-apis.vercel.app/api/gpt4?prompt=${encodeURIComponent("Give me a stylish and creative " + prompt + " in Bengali. Just give the text, no extra talk or headers. Use emojis.")}`);
            
            const caption = res.data.answer;

            // একদম ক্লিন আউটপুট
            const responseMessage = `${caption}\n\n━━━━━━━━━━━━━━━\n👤 𝗢𝘄𝗻𝗲𝗿: 𝗧𝗮𝘄𝗵𝗶𝗱 𝗔𝗵𝗺𝗲𝗱\n🎀 𝗔𝘀𝘀𝗶𝘀𝘁𝗮𝗻𝘁: 𝗡𝗲𝘇𝘂𝗸𝗼 𝗖𝗵𝗮𝗻`;

            return message.reply(responseMessage);

        } catch (err) {
            return message.reply("❌ সার্ভার একটু বিজি সোনা, আবার ট্রাই করো!");
        }
    }
};
