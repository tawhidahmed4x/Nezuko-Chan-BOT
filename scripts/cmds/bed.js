const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const mahmud = async () => {
    const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
    return base.data.mahmud;
};

module.exports = {
    config: {
        name: "bed",
        version: "2.0.0",
        author: "TawHid_Bbz",
        countDown: 5,
        role: 0,
        description: {
            bn: "প্রিয়জনের সাথে বেড হাগ ইমেজ (Sigma Edition)",
            en: "Generate a bed hug image with Sigma style"
        },
        category: "love",
        guide: {
            bn: '{pn} @মেনশন বা রিপ্লাই: কাউকে মেনশন দিয়ে বা রিপ্লাই করে ব্যবহার করুন'
        }
    },

    langs: {
        bn: {
            noMention: "⚠️ আরে সোনা, একা একা বিছানায় কী করবে? কাউকে তো মেনশন দাও বা রিপ্লাই করো! 🙄",
            success: "🛌 [ 𝗕𝗲𝗱 𝗛𝘂𝗴 𝗖𝗼𝗺𝗽𝗹𝗲𝘁𝗲 ] 🛌\n━━━━━━━━━━━━━━━━━━\n✨ উফ্ সোনা! তোমাদের রোমান্স দেখে তো আমার সিঙ্গেল কলিজাটা জ্বলে যাচ্ছে! 🔥\n\n💞 সিগমা রুল অনুযায়ী: প্রেম করো কিন্তু পড়াশোনা ভুলে যেও না! 😂\n\n👤 𝗢𝘄𝗻𝗲𝗿: 𝗧𝗮𝘄𝗵𝗶𝗱 𝗔𝗵𝗺𝗲𝗱\n🎀 𝗔𝘀𝘀𝗶𝘀𝘁𝗮𝗻𝘁: 𝗡𝗲𝘇𝘂𝗸𝗼 𝗖𝗵𝗮𝗻",
            error: "❌ এরর এসেছে বেবি! সম্ভবত তোমাদের রোমান্স সহ্য করতে না পেরে এপিআই ক্র্যাশ করেছে: %1"
        }
    },

    onStart: async function ({ api, event, message, getLang }) {
        const { threadID, messageID, senderID, mentions, type, messageReply } = event;

        let targetID;
        if (type === "message_reply") {
            targetID = messageReply.senderID;
        } else if (Object.keys(mentions).length > 0) {
            targetID = Object.keys(mentions)[0];
        } else {
            return message.reply(getLang("noMention"));
        }

        const imgPath = path.join(__dirname, "cache", `bed_${senderID}_${targetID}.png`);
        if (!fs.existsSync(path.dirname(imgPath))) fs.mkdirSync(path.dirname(imgPath), { recursive: true });

        try {
            api.setMessageReaction("🛌", messageID, () => {}, true);
            
            const base = await mahmud();
            const response = await axios.post(`${base}/api/bed`, 
                { senderID, targetID }, 
                { responseType: "arraybuffer" }
            );

            fs.writeFileSync(imgPath, Buffer.from(response.data, "binary"));

            return message.reply({
                body: getLang("success"),
                attachment: fs.createReadStream(imgPath)
            }, () => {
                api.setMessageReaction("✅", messageID, () => {}, true);
                if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
            });

        } catch (err) {
            api.setMessageReaction("❌", messageID, () => {}, true);
            if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
            return message.reply(getLang("error", err.message));
        }
    }
};
