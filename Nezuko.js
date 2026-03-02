process.on('unhandledRejection', error => console.log(error));
process.on('uncaughtException', error => console.log(error));

const fs = require("fs-extra");
const axios = require("axios");
const { execSync } = require('child_process');
const log = require('./logger/log.js');
const path = require("path");

process.env.BLUEBIRD_W_FORGOTTEN_RETURN = 0;

// JSON চেক করার সহজ ফাংশন
function validJSON(pathDir) {
	try {
		if (!fs.existsSync(pathDir)) return false;
		JSON.parse(fs.readFileSync(pathDir, 'utf-8'));
		return true;
	} catch (err) { return false; }
}

const { NODE_ENV } = process.env;
const dirConfig = path.normalize(`${__dirname}/config${['production', 'development'].includes(NODE_ENV) ? '.dev.json' : '.json'}`);
const dirConfigCommands = path.normalize(`${__dirname}/configCommands${['production', 'development'].includes(NODE_ENV) ? '.dev.json' : '.json'}`);

// গ্লোবাল অবজেক্ট সেটআপ
if (fs.existsSync(dirConfig)) {
	const config = require(dirConfig);
	global.GoatBot = {
		startTime: Date.now(),
		commands: new Map(),
		eventCommands: new Map(),
		config,
		configCommands: fs.existsSync(dirConfigCommands) ? require(dirConfigCommands) : {},
		onReply: new Map(),
		onReaction: new Map(),
		onEvent: [], // ইভেন্টের জন্য
		envCommands: {},
		envEvents: {},
		envGlobal: {},
		botID: null
	};
}

global.db = { allThreadData: [], allUserData: [], threadsData: null, usersData: null };
global.utils = require("./utils.js");
global.temp = { contentScripts: { cmds: {}, events: {} } };

// ———————————————— মেইন রান ফাংশन ———————————————— //
(async () => {
	try {
		const currentVersion = require("./package.json").version;
		console.clear();
		log.info("SYSTEM", `Nezuko Chan Bot v${currentVersion} is starting...`);
		log.info("AUTHOR", "Maintained by: TawHid_Bbz");

		// কমান্ড এবং ইভেন্ট ফোল্ডার চেক (scripts/cmd এবং scripts/events)
		const cmdPath = path.join(__dirname, 'scripts', 'cmd');
		const eventPath = path.join(__dirname, 'scripts', 'events');

		if (!fs.existsSync(cmdPath)) fs.ensureDirSync(cmdPath);
		if (!fs.existsSync(eventPath)) fs.ensureDirSync(eventPath);

		log.info("LOADER", "Detecting scripts in 'scripts/cmd' and 'scripts/events'...");
		log.info("MAIL", "Bypassing Google OAuth to prevent 'invalid_client' error.");

		// লগইন ফাইল রান করা (আসল লোডিং এখানেই হয়)
		const loginFile = `./bot/login/login${NODE_ENV === 'development' ? '.dev.js' : '.js'}`;
		if (fs.existsSync(path.join(__dirname, loginFile))) {
			require(loginFile);
		} else {
			log.error("SYSTEM", "Critical: Login controller file missing!");
		}

	} catch (err) {
		log.error("SYSTEM", `Startup Error: ${err.message}`);
	}
})();
