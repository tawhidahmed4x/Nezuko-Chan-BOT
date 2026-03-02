// set bash title
process.stdout.write("TawHid_Bbz 👑 | Nezuko-Chan Bot");

const fs = require("fs-extra");
const path = require("path");
const login = require("ws3-fca");

const { log, colors } = global.utils;

async function startBot() {
    // স্টাইলিশ ব্যানার
    const line = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";
    console.log(colors.hex("#00FFCC")(line));
    console.log(colors.hex("#FF3399")(`   👑 OWNER: TawHid_Bbz | NEZUKO-CHAN 🌸`));
    console.log(colors.hex("#00FFCC")(line));
    
    let appState = [];
    try {
        if (process.env.APPSTATE) {
            appState = JSON.parse(process.env.APPSTATE);
            console.log(colors.hex("#33FF33")(" ✅ [SYSTEM] AppState Loaded from Render Environment."));
        } else {
            const dirAccount = path.join(process.cwd(), "account.txt");
            if (fs.existsSync(dirAccount)) {
                appState = JSON.parse(fs.readFileSync(dirAccount, "utf8"));
                console.log(colors.hex("#33FF33")(" ✅ [SYSTEM] AppState Loaded from account.txt."));
            }
        }
    } catch (e) {
        console.log(colors.hex("#FF0000")(" ❌ [ERROR] AppState format is invalid!"));
    }

    if (!appState || appState.length === 0) {
        console.log(colors.hex("#FFCC00")(" ⚠️ [WARNING] No AppState found. Waiting for login..."));
        return;
    }

    const loginOptions = {
        appState,
        forceLogin: true,
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"
    };

    login({ appState }, loginOptions, async (err, api) => {
        if (err) {
            console.log(colors.hex("#FF0000")(` ❌ [LOGIN] Failed! Error: ${err.error}`));
            return;
        }

        console.log(colors.hex("#00FFFF")(" 📥 [LOGIN] Connection Established Successfully!"));
        
        global.GoatBot.fcaApi = api;
        global.GoatBot.botID = api.getCurrentUserID();

        try {
            console.log(colors.hex("#FF9900")(" 🔄 [DATABASE] Syncing Your Memories..."));
            const loadData = require("./loadData.js");
            await loadData(api, (c) => c);
            
            console.log(colors.hex("#00FFCC")(line));
            console.log(colors.hex("#FF3366")(" 🚀 [SUCCESS] Nezuko-Chan is Online Now!"));
            console.log(colors.hex("#00FFCC")(line));
        } catch (error) {
            console.log(colors.hex("#FF0000")(" ❌ [ERROR] Failed to load data controllers."));
            console.error(error);
        }
    });
}

module.exports = startBot;
