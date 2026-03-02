const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const cheerio = require("cheerio");
const https = require("https");
const agent = new https.Agent({ rejectUnauthorized: false });
const moment = require("moment-timezone");
const mimeDB = require("mime-db");
const _ = require("lodash");
const { google } = require("googleapis");
const ora = require("ora");
const log = require("./logger/log.js");
const { isHexColor, colors } = require("./func/colors.js");
const Prism = require("./func/prism.js");

const { config } = global.GoatBot;

// ———————————————— TRISHA'S BYPASS (V2) ———————————————— //
const credentials = config.credentials || {};
const gmailAccount = credentials.gmailAccount || {};
const { clientId, clientSecret, refreshToken, apiKey: googleApiKey } = gmailAccount;

let driveApi = null;
if (clientId && clientSecret && refreshToken) {
    try {
        const oauth2ClientForGGDrive = new google.auth.OAuth2(clientId, clientSecret, "https://developers.google.com/oauthplayground");
        oauth2ClientForGGDrive.setCredentials({ refresh_token: refreshToken });
        driveApi = google.drive({ version: 'v3', auth: oauth2ClientForGGDrive });
    } catch (e) {
        log.warn("DRIVE", "Drive API initialized failed. Skipping...");
    }
} else {
    // ক্রেডেনশিয়াল না থাকলেও লগ-এ এরর দেখাবে না, জাস্ট স্কিপ করবে
    if (!global.skipMailLog) {
        log.info("MAIL", "No Gmail Credentials found. Bypassing...");
        global.skipMailLog = true;
    }
}

const word = ['A', 'a', 'B', 'b', 'C', 'c', 'D', 'd', 'E', 'e', 'F', 'f', 'G', 'g', 'H', 'h', 'I', 'i', 'J', 'j', 'K', 'k', 'L', 'l', 'M', 'm', 'N', 'n', 'O', 'o', 'P', 'p', 'Q', 'q', 'R', 'r', 'S', 's', 'T', 't', 'U', 'u', 'V', 'v', 'W', 'w', 'X', 'x', 'Y', 'y', 'Z', 'z', ' '];
const regCheckURL = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

class CustomError extends Error {
    constructor(obj) {
        if (typeof obj === 'string') obj = { message: obj };
        super(obj.message || "Unknown Error");
        Object.assign(this, obj);
    }
}

const utils = {
    CustomError,
    colors,
    log,
    convertTime: (ms) => moment.duration(ms).format("h:mm:ss"),
    createOraDots: (text) => new ora({ text, spinner: "dots" }),
    formatNumber: (n) => Number(n).toLocaleString("en-US"),
    getPrefix: (threadID) => {
        let prefix = global.GoatBot.config.prefix;
        const threadData = global.db.allThreadData.find(t => t.threadID == threadID);
        if (threadData) prefix = threadData.data.prefix || prefix;
        return prefix;
    },
    getTime: (ts, fmt) => moment(ts).tz(config.timeZone).format(fmt),
    getType: (v) => Object.prototype.toString.call(v).slice(8, -1),
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
    translateAPI: async (t, l) => {
        const res = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${l}&dt=t&q=${encodeURIComponent(t)}`);
        return res.data[0][0][0];
    },
    drive: {
        default: driveApi,
        getUrlDownload: (id) => `https://docs.google.com/uc?id=${id}&export=download${googleApiKey ? `&key=${googleApiKey}` : ''}`,
        makePublic: async (id) => { if (driveApi) await driveApi.permissions.create({ fileId: id, requestBody: { role: 'reader', type: 'anyone' } }); return id; }
    },
    removeHomeDir: (p) => p.replace(process.cwd(), ""),
    getText: require("./languages/makeFuncGetLangs.js")
};

module.exports = utils;
