// set bash title
process.stdout.write("TawHid_Bbz 👑"); // তোমার নাম এখানে সেট করা হয়েছে

const defaultRequire = require;
const fs = require("fs-extra");
const path = require("path");
const login = require("ws3-fca");

// Safe global access to prevent undefined errors
if (!global.client) global.client = {};
global.client.dirAccount = global.client.dirAccount || path.join(process.cwd(), "account.txt");
const { dirAccount } = global.client;

const { log, colors, getText } = global.utils || { 
    log: { err: console.error, info: console.log, warn: console.warn }, 
    colors: { hex: () => (t) => t } 
};

// ... (তোমার বাকি ফাংশনগুলো যেমন decode, getName, compareVersion সব একই থাকবে) ...

async function getAppStateToLogin(loginWithEmail) {
	let appState = [];
	
	// --- RENDER ENVIRONMENT FIRST ---
	if (process.env.APPSTATE) {
		try {
			appState = JSON.parse(process.env.APPSTATE);
			log.info("LOGIN", "Successfully loaded AppState from Render Environment.");
			return appState;
		} catch (e) {
			log.err("LOGIN", "Failed to parse APPSTATE from Environment Variables.");
		}
	}

	// ফাইল না থাকলেও যেন ক্র্যাশ না করে তার জন্য safe check
	if (!fs.existsSync(dirAccount)) {
		return appState; // খালি থাকলে রেন্ডার এনভায়রনমেন্ট ইউজ করবে
	}

	try {
		const accountText = fs.readFileSync(dirAccount, "utf8");
		appState = JSON.parse(accountText);
	} catch (e) {
		appState = [];
	}
	return appState;
}

async function startBot(loginWithEmail) {
	let appState = await getAppStateToLogin(loginWithEmail);
	
	if (!appState || appState.length === 0) {
		log.err("LOGIN", "No AppState found! Check your Render Environment Variables.");
		return;
	}

	login({ appState }, { forceLogin: true, logLevel: "silent" }, async (err, api) => {
		if (err) return log.err("LOGIN", "Facebook login failed!");

		global.GoatBot.fcaApi = api;
		global.GoatBot.botID = api.getCurrentUserID();

		// ———————————————————— DATABASE LOAD FIX ———————————————————— //
		try {
			log.info("DATABASE", "TawHid_Bbz, memories loading...");
			const loadDataPath = path.join(process.cwd(), "bot/login/loadData.js");
			
			if (fs.existsSync(loadDataPath)) {
				const loadData = require(loadDataPath);
				
				// TypeError: require(...) is not a function - এই এররটা বন্ধ করার জন্য এই চেক:
				if (typeof loadData === 'function') {
					await loadData(api, (c) => c);
				} else if (loadData.default && typeof loadData.default === 'function') {
					await loadData.default(api, (c) => c);
				}
				
				log.info("SUCCESS", "Nezuko-Chan is Online Now!");
			} else {
				log.err("DATABASE", "loadData.js file not found in bot/login/");
			}
		} catch (error) {
			log.err("DATABASE", "Critical Error during data loading!");
			console.error(error);
		}
		// ———————————————————————————————————————————————————————————— //
	});
}

startBot();
