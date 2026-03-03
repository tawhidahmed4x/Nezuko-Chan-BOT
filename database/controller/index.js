const path = require("path");
const { log } = global.utils;
const { config } = global.GoatBot;
const databaseType = config.database.type;

module.exports = async function (api) {
    var threadModel, userModel, dashBoardModel, globalModel, sequelize = null;
    const type = (databaseType || "json").toLowerCase();

    if (type === "mongodb") {
        const connectMongoDB = require("../connectDB/connectMongoDB.js");
        const mongoDB = await connectMongoDB(config.database.uriMongodb);
        ({ threadModel, userModel, dashBoardModel, globalModel } = mongoDB);
    } 
    else if (type === "sqlite") {
        const connectSqlite = require("../connectDB/connectSqlite.js");
        const sqliteDB = await connectSqlite();
        ({ threadModel, userModel, dashBoardModel, globalModel, sequelize } = sqliteDB);
    }

    const ctrlDir = path.join(process.cwd(), "database/controller");

    async function safeLoad(fileName, ...args) {
        try {
            const filePath = path.join(ctrlDir, fileName);
            const dataFile = require(filePath);

            if (typeof dataFile === "function") {
                return await dataFile(...args);
            } else {
                console.log(`[DATABASE] ${fileName} is not a function. Skipping...`);
                return {};
            }
        } catch (err) {
            console.log(`[DATABASE] Failed to load ${fileName}:`, err.message);
            return {};
        }
    }

    const threadsData   = await safeLoad("threadsData.js", databaseType, threadModel, api, (q, d) => d);
    const usersData     = await safeLoad("usersData.js", databaseType, userModel, api, (q, d) => d);
    const dashBoardData = await safeLoad("dashBoardData.js", databaseType, dashBoardModel, (q, d) => d);
    const globalData    = await safeLoad("globalData.js", databaseType, globalModel, (q, d) => d);

    global.db = { 
        ...global.db, 
        threadsData, 
        usersData, 
        dashBoardData, 
        globalData, 
        sequelize 
    };

    return { 
        threadModel, 
        userModel, 
        dashBoardModel, 
        globalModel, 
        threadsData, 
        usersData, 
        dashBoardData, 
        globalData, 
        sequelize 
    };
};
