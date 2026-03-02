module.exports.config = {
    name: "brainwash",
    version: "2.2.0",
    hasPermssion: 0,
    credits: "Tawhid Ahmed",
    description: "কাউকে মেনশন দিয়ে বা রিপ্লাই দিয়ে ফানি ব্রেইনওয়াশ করার কমান্ড",
    commandCategory: "Fun",
    usages: "brainwash @mention / reply to message",
    cooldowns: 5
};

module.exports.onStart = async function ({ api, event, args, usersData }) {
    const { threadID, messageID, senderID, mentions, type, messageReply } = event;

    let mentionID;

    // ১. রিপ্লাই চেক করা (যদি রিপ্লাই দেয়)
    if (type === "message_reply") {
        mentionID = messageReply.senderID;
    } 
    // ২. মেনশন চেক করা (যদি মেনশন দেয়)
    else if (Object.keys(mentions).length > 0) {
        mentionID = Object.keys(mentions)[0];
    } 
    // ৩. যদি কিছুই না করে
    else {
        return api.sendMessage("⚠️ আরে সোনা, কাকে ব্রেইনওয়াশ করবে তাকে মেনশন দাও অথবা তার মেসেজে রিপ্লাই করো! 🙄", threadID, messageID);
    }

    const name = await usersData.getName(mentionID) || "User";

    const lines = [
        `🧠 [ 𝗕𝗿𝗮𝗶𝗻𝘄𝗮𝘀𝗵𝗶𝗻𝗴 𝗦𝘁𝗮𝗿𝘁𝗲𝗱 ] 🧠\n━━━━━━━━━━━━━━━━━━\n🌀 ${name}, তোমার মাথার ভেতরে জং ধরা নাট-বল্টু পরিষ্কার করা হচ্ছে...`,
        `🧼 সাবান আর হুইল পাউডার দিয়ে ${name}-এর মগজ ধোলাই চলছে... উফ্! কত ময়লা! 🤮`,
        `💾 ${name}-এর পুরনো আবর্জনা মেমোরি ডিলিট করা হচ্ছে... [████████▒▒] 𝟴𝟬%`,
        `🚫 Warning! ${name}-এর মাথায় বুদ্ধির বদলে শুধু গোবর পাওয়া গেছে! সেটি সরানো হচ্ছে...`,
        `✨ সফলভাবে ব্রেইনওয়াশ করা হয়েছে! এখন ${name} নিজেকে Tawhid Ahmed-এর পাখা মনে করছে! 😎`,
        `🎀 এখন থেকে ${name} আর আজেবাজে চিন্তা করবে না, শুধু বটের কথা শুনবে!`,
        `✅ 𝗗𝗼𝗻𝗲! ${name} এখন একদম নতুনের মতো রিফ্রেশড! কিন্তু বুদ্ধি আর ফিরে আসলো না... 😹`
    ];

    api.sendMessage(`🔄 ${name}-কে ব্রেইনওয়াশ করা শুরু করলাম সোনা, একটু সময় দাও...`, threadID, messageID);

    // একে একে মেসেজ পাঠানোর লজিক
    for (const line of lines) {
        await new Promise(resolve => setTimeout(resolve, 2500)); // ২.৫ সেকেন্ড পর পর লাইন আসবে
        api.sendMessage(line, threadID);
    }

    return api.sendMessage(`🎊 অভিনন্দন ${name}! তোমার ব্রেইন এখন একদম ক্লিন!\n━━━━━━━━━━━━━━━━━━\n👤 𝗢𝘄𝗻𝗲𝗿: 𝗧𝗮𝘄𝗵𝗶𝗱 𝗔𝗵𝗺𝗲𝗱\n🎀 𝗔𝘀𝘀𝗶𝘀𝘁𝗮𝗻𝘁: 𝗡𝗲𝘇𝘂𝗸𝗼 𝗖𝗵𝗮𝗻`, threadID);
};
