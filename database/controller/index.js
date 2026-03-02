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

	const controllerDir = path.join(process.cwd(), "database/controller");

	// Logic for JSON Mode
	const threadsData = await require("./threadsData.js")(databaseType, threadModel, api, (q, d) => d);
	const usersData = await require("./usersData.js")(databaseType, userModel, api, (q, d) => d);
	const dashBoardData = await require("./dashBoardData.js")(databaseType, dashBoardModel, (q, d) => d);
	const globalData = await require("./globalData.js")(databaseType, globalModel, (q, d) => d);

	global.db = { ...global.db, threadsData, usersData, dashBoardData, globalData, sequelize };

	return { threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData, sequelize };
};
