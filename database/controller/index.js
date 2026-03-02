const ora = require("ora");
const path = require("path");
const { log, getText } = global.utils;
const { config } = global.GoatBot;
const databaseType = config.database.type;

module.exports = async function (api) {
	var threadModel, userModel, dashBoardModel, globalModel, sequelize = null;
	const type = (databaseType || "json").toLowerCase();

	if (type === "mongodb") {
		try {
			const connectMongoDB = require("../connectDB/connectMongoDB.js");
			const mongoDB = await connectMongoDB(config.database.uriMongodb);
			({ threadModel, userModel, dashBoardModel, globalModel } = mongoDB);
			log.info("MONGODB", "Connected successfully!");
		} catch (err) {
			log.err("MONGODB", "Connection error!", err);
			process.exit();
		}
	} else if (type === "sqlite") {
		try {
			const connectSqlite = require("../connectDB/connectSqlite.js");
			const sqliteDB = await connectSqlite();
			({ threadModel, userModel, dashBoardModel, globalModel, sequelize } = sqliteDB);
			log.info("SQLITE", "Connected successfully!");
		} catch (err) {
			log.err("SQLITE", "Connection error!", err);
			process.exit();
		}
	} else {
		log.info("DATABASE", "Connecting to JSON database...");
	}

	// PATH FIX: process.cwd() use kora hoyeche jate main directory theke load hoy
	const baseDir = path.join(process.cwd(), "database/controller");
	
	const threadsData = await require(path.join(baseDir, "threadsData.js"))(databaseType, threadModel, api, (q, d) => d);
	const usersData = await require(path.join(baseDir, "usersData.js"))(databaseType, userModel, api, (q, d) => d);
	const dashBoardData = await require(path.join(baseDir, "dashBoardData.js"))(databaseType, dashBoardModel, (q, d) => d);
	const globalData = await require(path.join(baseDir, "globalData.js"))(databaseType, globalModel, (q, d) => d);

	global.db = { ...global.db, threadsData, usersData, dashBoardData, globalData, sequelize };

	return { threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData, sequelize };
};
