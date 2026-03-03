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
    } else if (type === "sqlite") {
        const connectSqlite = require("../connectDB/connectSqlite.js");
        const sqliteDB = await connectSqlite();
        ({ threadModel, userModel, dashBoardModel, globalModel, sequelize } = sqliteDB);
    }

    // PATH: Render log anujayi /src/ thakbe
    const ctrlDir = path.join(process.cwd(), "src/database/controller");

    // We separate require and execution to kill the TypeError
    const tdFile = require(path.join(ctrlDir, "threadsData.js"));
    const threadsData = await tdFile(databaseType, threadModel, api, (q, d) => d);

    const udFile = require(path.join(ctrlDir, "usersData.js"));
    const usersData = await udFile(databaseType, userModel, api, (q, d) => d);

    const ddFile = require(path.join(ctrlDir, "dashBoardData.js"));
    const dashBoardData = await ddFile(databaseType, dashBoardModel, (q, d) => d);

    const gdFile = require(path.join(ctrlDir, "globalData.js"));
    const globalData = await gdFile(databaseType, globalModel, (q, d) => d);

    global.db = { ...global.db, threadsData, usersData, dashBoardData, globalData, sequelize };

    return { threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData, sequelize };
};
