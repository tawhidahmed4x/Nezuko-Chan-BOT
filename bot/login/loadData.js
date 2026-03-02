const path = require('path');
const { log, colors } = global.utils;

module.exports = async function (api, createLine) {
    console.log(colors.hex("#66FFFF")(" 📊 [DATA] Loading Threads and Users Information..."));
    
    try {
        const controllerPath = path.join(process.cwd(), 'database/controller/index.js');
        await require(controllerPath)(api);
        
        // সুন্দর করে ডাটা কাউন্ট দেখানো
        console.log(colors.hex("#FFCCFF")(` ✨ [THREADS] ${global.db.allThreadData.length} groups/chats loaded.`));
        console.log(colors.hex("#CCFFCC")(` ✨ [USERS] ${global.db.allUserData.length} users recognized.`));
    } catch (err) {
        console.log(colors.hex("#FF4D4D")(" ❌ [DATABASE ERROR] Check your JSON files!"));
        throw err;
    }
};
