const { colors } = require('../func/colors.js');
const moment = require("moment-timezone");
const characters = '🦋'; // এখানে একটা কিউট ইমোজি দিলাম
const getCurrentTime = () => colors.gray(`[${moment().tz('Asia/Dhaka').format('HH:mm:ss DD/MM/YYYY')}]`);

function logError(prefix, message) {
	if (message === undefined) {
		message = prefix;
		prefix = "ERROR";
	}
	process.stderr.write(`\n${getCurrentTime()} ${colors.redBright(`${characters} ${prefix}:`)} ${message}`);
}

module.exports = {
	err: logError,
	error: logError,
	warn: function (prefix, message) {
		if (message === undefined) {
			message = prefix;
			prefix = "WARN";
		}
		process.stderr.write(`\n${getCurrentTime()} ${colors.yellowBright(`${characters} ${prefix}:`)} ${message}`);
	},
	info: function (prefix, message) {
		if (message === undefined) {
			message = prefix;
			prefix = "INFO";
		}
		process.stderr.write(`\n${getCurrentTime()} ${colors.greenBright(`${characters} ${prefix}:`)} ${message}`);
	},
	succes: function (prefix, message) {
		if (message === undefined) {
			message = prefix;
			prefix = "SUCCESS";
		}
		process.stderr.write(`\n${getCurrentTime()} ${colors.cyanBright(`${characters} ${prefix}:`)} ${message}`);
	},
	master: function (prefix, message) {
		if (message === undefined) {
			message = prefix;
			prefix = "NEZUKO"; // মাস্টার এর বদলে বটের নাম দিলাম
		}
		process.stderr.write(`\n${getCurrentTime()} ${colors.hex("#eb6734", `${characters} ${prefix}:`)} ${message}`);
	}
};
