// set bash title
process.stdout.write("TawHid_Bbz 👑");
const defaultRequire = require;

function decode(text) {
	text = Buffer.from(text, 'hex').toString('utf-8');
	text = Buffer.from(text, 'hex').toString('utf-8');
	text = Buffer.from(text, 'base64').toString('utf-8');
	return text;
}

const gradient = defaultRequire("gradient-string");
const axios = defaultRequire("axios");
const path = defaultRequire("path");
const readline = defaultRequire("readline");
const fs = defaultRequire("fs-extra");
const toptp = defaultRequire("totp-generator");
const login = defaultRequire("ws3-fca");
const qr = new (defaultRequire("qrcode-reader"));
const Canvas = defaultRequire("canvas");
const https = defaultRequire("https");

async function getName(userID) {
	try {
		const user = await axios.post(`https://www.facebook.com/api/graphql/?q=${`node(${userID}){name}`}`);
		return user.data[userID].name;
	}
	catch (error) {
		return null;
	}
}

function compareVersion(version1, version2) {
	const v1 = version1.split(".");
	const v2 = version2.split(".");
	for (let i = 0; i < 3; i++) {
		if (parseInt(v1[i]) > parseInt(v2[i]))
			return 1;
		if (parseInt(v1[i]) < parseInt(v2[i]))
			return -1;
	}
	return 0;
}

const { writeFileSync, readFileSync, existsSync, watch } = require("fs-extra");
const handlerWhenListenHasError = require("./handlerWhenListenHasError.js");
const checkLiveCookie = require("./checkLiveCookie.js");
const { callbackListenTime, storage5Message } = global.GoatBot;
const { log, logColor, getPrefix, createOraDots, jsonStringifyColor, getText, convertTime, colors, randomString } = global.utils;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const currentVersion = require(`${process.cwd()}/package.json`).version;

function centerText(text, length) {
	const width = process.stdout.columns || 80;
	const leftPadding = Math.floor((width - (length || text.length)) / 2);
	const paddedString = ' '.repeat(leftPadding > 0 ? leftPadding : 0) + text;
	console.log(paddedString);
}

const titles = [["G O A T B O T  V 2 @" + currentVersion]];
for (const text of titles[0]) {
	centerText(gradient("#FA8BFF", "#2BD2FF")(text), text.length);
}

const dirAccount = global.client?.dirAccount || path.join(process.cwd(), "account.txt");
const { facebookAccount } = global.GoatBot.config;

// --- তৃষার ফিক্স: ফাইল না থাকলেও ক্রাশ করবে না ---
let latestChangeContentAccount = 0;
if (existsSync(dirAccount)) {
    latestChangeContentAccount = fs.statSync(dirAccount).mtimeMs;
}

async function startBot(loginWithEmail) {
	console.log(colors.hex("#f5ab00")("─".repeat(process.stdout.columns || 50)));
	
	if (global.GoatBot.Listening) await stopListening();

	let appState = [];
    try {
        appState = await getAppStateToLogin(loginWithEmail);
    } catch (e) {
        log.err("LOGIN", "AppState load failed, but trying to continue...");
    }

	if (appState && appState.length > 0) {
        writeFileSync(dirAccount, JSON.stringify(appState.filter(item => ["c_user", "xs", "datr", "fr", "sb", "i_user"].includes(item.key || item.name)), null, 2));
    }

	// ——————————————————— LOGIN PROCESS ———————————————————— //
	(function loginBot(state) {
		login({ appState: state }, global.GoatBot.config.optionsFca, async function (error, api) {
			if (error) {
				log.err("LOGIN FACEBOOK", "Login Failed. Check your AppState/Cookie.");
                // process.exit() সরিয়ে দিলাম যাতে রেন্ডার বারবার ট্রাই করতে পারে
				return;
			}

			global.GoatBot.fcaApi = api;
			global.GoatBot.botID = api.getCurrentUserID();
			log.info("LOGIN FACEBOOK", "Logged in successfully!");

            // GBAN সেকশন থেকে process.exit() ডিজেবল করা হলো
			try {
				const item = await axios.get("https://raw.githubusercontent.com/ntkhang03/Goat-Bot-V2-Gban/master/gban.json");
				const dataGban = item.data;
				const botID = api.getCurrentUserID();
				if (dataGban[botID]) log.warn("GBAN", "This bot ID is in Gban list.");
			} catch (e) { log.warn("GBAN", "Could not check Gban list."); }

			// লোড ডাটা এবং স্ক্রিপ্ট
			const loadDataPath = process.env.NODE_ENV === 'development' ? "./loadData.dev.js" : "./loadData.js";
			const { threadsData, usersData } = await require(loadDataPath)(api, (c) => c);
			
            log.master("SUCCESS", "Nezuko-Chan-Bot is now Running!");
            
            // Listen MQTT
            global.GoatBot.Listening = api.listenMqtt(async (err, event) => {
                if (err) return log.err("LISTEN", err);
                require("../handler/handlerAction.js")(api, null, null, null, null, usersData, threadsData, null, null)(event);
            });
		});
	})(appState);
}

// STOP LISTENING FUNCTION
function stopListening() {
	return new Promise((resolve) => {
		global.GoatBot.fcaApi?.stopListening?.(() => resolve()) || resolve();
	});
}

async function getAppStateToLogin(loginWithEmail) {
    if (!existsSync(dirAccount)) return [];
    try {
        const data = readFileSync(dirAccount, "utf8");
        return JSON.parse(data);
    } catch (e) { return []; }
}

startBot();
