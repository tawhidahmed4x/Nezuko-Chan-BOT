// set bash title
process.stdout.write("TawHid_Bbz 👑");

const fs = require("fs-extra");
const path = require("path");
const login = require("ws3-fca");

// Safe global utils access
const { log, colors } = global.utils || { 
    log: { err: console.error, info: console.log }, 
    colors: { hex: () => (t) => t } 
};

// Initialize global object to prevent undefined errors
if (!global.client) global.client = {};
if (!global.GoatBot) global.GoatBot = {};

async function startBot() {
    const line = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";
    console.log(colors.hex("#FF3399")(line));
    console.log(colors.hex("#00FFCC")(`   👑 OWNER: TawHid_Bbz | NEZUKO-CHAN 🌸`));
    console.log(colors.hex("#FF3399")(line));

    let appState = [];

    // --- ONLY CHECK RENDER ENVIRONMENT ---
    try {
        if (process.env.APPSTATE) {
            appState = JSON.parse(process.env.APPSTATE);
            console.log(colors.hex("#00FF00")(" ✅ [SYSTEM] AppState loaded from Render Environment."));
        } else {
            console.log(colors.hex("#FF0000")(" ❌ [ERROR] APPSTATE not found in Render Environment Variables!"));
            return;
        }
    } catch (e) {
        console.log(colors.hex("#FF0000")(" ❌ [ERROR] AppState format is invalid! Check your JSON."));
        return;
    }

    const loginOptions = {
        appState,
        forceLogin: true,
        logLevel: "silent",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"
    };

    login({ appState }, loginOptions, async (err, api) => {
        if (err) {
            console.log(colors.hex("#FF0000")(" ❌ [LOGIN] Facebook Login Failed! Cookie might be expired."));
            return;
        }

        console.log(colors.hex("#00FFFF")(" 📥 [LOGIN] Connected with Facebook!"));
        global.GoatBot.fcaApi = api;
        global.GoatBot.botID = api.getCurrentUserID();

        try {
            console.log(colors.hex("#FF9900")(" 🔄 [DATABASE] TawHid_Bbz, memories loading..."));
            
            // Path structure for loading data from src folder
            const loadDataPath = path.join(process.cwd(), "bot/login/loadData.js");
            
            if (fs.existsSync(loadDataPath)) {
                const loadData = require(loadDataPath);
                await loadData(api);
                
                console.log(colors.hex("#FF3399")(line));
                console.log(colors.hex("#00FFCC")(" 🚀 [SUCCESS] Nezuko-Chan is Online Now!"));
                console.log(colors.hex("#FF3399")(line));
            } else {
                console.log(colors.hex("#FF0000")(" ❌ [ERROR] loadData.js not found in src/bot/login/"));
            }
        } catch (error) {
            console.log(colors.hex("#FF0000")(" ❌ [LOAD ERROR] Database loading failed!"));
            console.error(error);
        }
    });
}

// Start the process
startBot();

module.exports = startBot;
