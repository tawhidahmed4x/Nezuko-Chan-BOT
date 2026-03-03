process.stdout.write("TawHid_Bbz 👑");
const fs = require("fs-extra");
const path = require("path");
const login = require("ws3-fca");
const { log, colors } = global.utils;

async function startBot() {
    const line = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";
    console.log(colors.hex("#FF3399")(line));
    console.log(colors.hex("#00FFCC")(`   👑 OWNER: TawHid_Bbz | NEZUKO-CHAN 🌸`));
    console.log(colors.hex("#FF3399")(line));

    let appState = [];
    try {
        if (process.env.APPSTATE) {
            appState = JSON.parse(process.env.APPSTATE);
        } else {
            const dirAccount = path.join(process.cwd(), "account.txt");
            if (fs.existsSync(dirAccount)) appState = JSON.parse(fs.readFileSync(dirAccount, "utf8"));
        }
    } catch (e) { log.err("LOGIN", "AppState Error!"); }

    if (!appState || appState.length === 0) return log.err("LOGIN", "No AppState found!");

    login({ appState }, { forceLogin: true, logLevel: "silent" }, async (err, api) => {
        if (err) return log.err("LOGIN", "Login Failed!");

        console.log(colors.hex("#00FFFF")(" 📥 [LOGIN] Connected with Facebook!"));
        global.GoatBot.fcaApi = api;
        global.GoatBot.botID = api.getCurrentUserID();

        try {
            const loadDataPath = path.join(process.cwd(), "bot/login/loadData.js");
            const loadData = require(loadDataPath);
            await loadData(api);
            console.log(colors.hex("#FF3399")(line));
            console.log(colors.hex("#00FFCC")(" 🚀 [SUCCESS] Nezuko-Chan is Online Now!"));
            console.log(colors.hex("#FF3399")(line));
        } catch (e) { log.err("LOAD", "Data Load Error!"); }
    });
}
startBot();
module.exports = startBot;
