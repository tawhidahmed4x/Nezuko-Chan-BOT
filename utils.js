const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const cheerio = require("cheerio");
const moment = require("moment-timezone");
const mimeDB = require("mime-db");
const _ = require("lodash");
const { google } = require("googleapis");
const ora = require("ora");
const log = require("./logger/log.js");
const { isHexColor, colors } = require("./func/colors.js");
const Prism = require("./func/prism.js");

const { config } = global.GoatBot;

// --- TaskQueue Class (এটা ডেটাবেসের জন্য দরকার) ---
class TaskQueue {
    constructor(callback) { this.queue = []; this.running = null; this.callback = callback; }
    push(task) { this.queue.push(task); if (this.queue.length == 1) this.next(); }
    next() {
        if (this.queue.length > 0) {
            const task = this.queue[0]; this.running = task;
            this.callback(task, async (err, result) => { this.running = null; this.queue.shift(); this.next(); });
        }
    }
    length() { return this.queue.length; }
}

const utils = {
    TaskQueue, // এটা অবশ্যই থাকতে হবে
    CustomError: class extends Error { constructor(obj) { super(obj.message || obj); Object.assign(this, obj); } },
    colors,
    log,
    getPrefix: (threadID) => {
        let prefix = global.GoatBot.config.prefix;
        const threadData = global.db.allThreadData?.find(t => t.threadID == threadID);
        if (threadData) prefix = threadData.data.prefix || prefix;
        return prefix;
    },
    getTime: (ts, fmt) => moment(ts).tz(config.timeZone).format(fmt),
    convertTime: (ms) => moment.duration(ms).format("h:mm:ss"),
    formatNumber: (n) => Number(n).toLocaleString("en-US"),
    createOraDots: (text) => new ora({ text, spinner: "dots" }),
    message: (api, event) => ({
        send: (f, cb) => api.sendMessage(f, event.threadID, cb),
        reply: (f, cb) => api.sendMessage(f, event.threadID, cb, event.messageID),
        unsend: (id) => api.unsendMessage(id),
        reaction: (e, id) => api.setMessageReaction(e, id, () => {}, true)
    }),
    downloadFile: async (url, p) => {
        const res = await axios.get(url, { responseType: "arraybuffer" });
        fs.writeFileSync(p, Buffer.from(res.data));
        return p;
    },
    getText: require("./languages/makeFuncGetLangs.js"),
    drive: { getUrlDownload: (id) => `https://docs.google.com/uc?id=${id}&export=download` }
};

module.exports = utils;
