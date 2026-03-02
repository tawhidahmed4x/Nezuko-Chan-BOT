const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");
const ora = require("ora");

// --- TaskQueue Class ---
class TaskQueue {
    constructor(callback) { this.queue = []; this.running = null; this.callback = callback; }
    push(task) { this.queue.push(task); if (this.queue.length == 1) this.next(); }
    next() {
        if (this.queue.length > 0) {
            const task = this.queue[0]; this.running = task;
            this.callback(task, async (err, result) => { this.running = null; this.queue.shift(); this.next(); });
        }
    }
}

const utils = {
    TaskQueue,
    colors: {
        hex: (color) => (text) => text,
        green: (text) => text,
        blueBright: (text) => text,
        yellow: (text) => text,
        red: (text) => text
    },
    log: require("./logger/log.js"),
    logColor: (color, text) => console.log(text),
    getTime: (ts, fmt) => moment(ts).tz("Asia/Dhaka").format(fmt),
    formatNumber: (n) => Number(n).toLocaleString("en-US"),
    createOraDots: (text) => new ora({ text, spinner: "dots" }),
    getPrefix: (threadID) => global.GoatBot?.config?.prefix || "/",
    getType: (v) => Object.prototype.toString.call(v).slice(8, -1),
    convertTime: (ms) => moment.duration(ms).format("h:mm:ss"),
    removeHomeDir: (p) => p.replace(process.cwd(), ""),
    getText: require("./languages/makeFuncGetLangs.js"),
    
    // --- DATABASE FIX ---
    database: { data: { threads: [], users: [], global: [] } },
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
    drive: { getUrlDownload: (id) => `https://docs.google.com/uc?id=${id}&export=download` }
};

// Global initialization to prevent "undefined" errors
global.db = global.db || { allThreadData: [], allUserData: [], database: { data: { threads: [], users: [] } } };
global.utils = utils;

module.exports = utils;
