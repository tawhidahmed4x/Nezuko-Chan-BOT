// set bash title
process.stdout.write("TawHid_Bbz 👑");
const defaultRequire = require;

const gradient = defaultRequire("gradient-string");
const axios = defaultRequire("axios");
const path = defaultRequire("path");
const fs = require("fs-extra");
const login = defaultRequire("ws3-fca");

const { log, colors } = global.utils || { log: console, colors: { hex: () => (t) => t } };

// --- TRISHA'S DIR FIX ---
const dirAccount = (global.client && global.client.dirAccount) ? global.client.dirAccount : path.join(process.cwd(), "account.txt");

async function startBot() {
    console.log(colors.hex("#f5ab00")("─".repeat(process.stdout.columns || 50)));
    
    let appState = [];
    try {
        if (fs.existsSync(dirAccount)) {
            appState = JSON.parse(fs.readFileSync(dirAccount, "utf8"));
        } else if (process.env.APPSTATE) {
            appState = JSON.parse(process.env.APPSTATE);
        }
    } catch (e) {
        log.err("LOGIN", "AppState load failed. Please check your Environment Variables.");
    }

    if (appState.length === 0) {
        log.err("LOGIN", "No AppState found! Please add your cookie to Render Env.");
        return;
    }

    const loginOptions = {
        appState: appState,
        forceLogin: true,
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"
    };

    login({ appState }, loginOptions, async (err, api) => {
        if (err) {
            log.err("LOGIN", "Facebook login failed! Your cookie might be expired or IP blocked.");
            return;
        }

        log.info("LOGIN", "Logged in successfully!");
        global.GoatBot.fcaApi = api;
        global.GoatBot.botID = api.getCurrentUserID();

        const loadDataPath = "./loadData.js";
        const { threadsData, usersData } = await require(loadDataPath)(api, (c) => c);
        
        log.master("SUCCESS", "Nezuko-Chan-Bot is now Running!");

        api.listenMqtt(async (err, event) => {
            if (err) return;
            require("../handler/handlerAction.js")(api, null, null, null, null, usersData, threadsData, null, null)(event);
        });
    });
}

startBot();
