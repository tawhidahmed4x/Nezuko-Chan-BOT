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

	// PATH FIX: Separating require and execution to avoid TypeError
	const controllerDir = path.join(process.cwd(), "database/controller");

	const threadsDataFunc = require(path.join(controllerDir, "threadsData.js"));
	const threadsData = await threadsDataFunc(databaseType, threadModel, api, (q, d) => d);

	const usersDataFunc = require(path.join(controllerDir, "usersData.js"));
	const usersData = await usersDataFunc(databaseType, userModel, api, (q, d) => d);

	const dashBoardDataFunc = require(path.join(controllerDir, "dashBoardData.js"));
	const dashBoardData = await dashBoardDataFunc(databaseType, dashBoardModel, (q, d) => d);

	const globalDataFunc = require(path.join(controllerDir, "globalData.js"));
	const globalData = await globalDataFunc(databaseType, globalModel, (q, d) => d);

	global.db = { ...global.db, threadsData, usersData, dashBoardData, globalData, sequelize };

	return { threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData, sequelize };
};
