const path = require("path");
const { log } = global.utils;
const { config } = global.GoatBot;
const databaseType = config.database.type;

module.exports = async function (api) {
	var threadModel, userModel, dashBoardModel, globalModel, sequelize = null;
	const type = (databaseType || "json").toLowerCase();

	// —————————————— INITIALIZE GLOBAL OBJECTS —————————————— //
	// এই অংশটুকু না থাকলে 'undefined' এরর আসে
	if (!global.client.database) global.client.database = {
		creatingThreadData: [],
		creatingUserData: [],
		creatingDashBoardData: [],
		creatingGlobalData: []
	};
	// —————————————————————————————————————————————————————— //

	if (type === "mongodb") {
		const connectMongoDB = require("../connectDB/connectMongoDB.js");
		const mongoDB = await connectMongoDB(config.database.uriMongodb);
		({ threadModel, userModel, dashBoardModel, globalModel } = mongoDB);
	} else if (type === "sqlite") {
		const connectSqlite = require("../connectDB/connectSqlite.js");
		const sqliteDB = await connectSqlite();
		({ threadModel, userModel, dashBoardModel, globalModel, sequelize } = sqliteDB);
	}

	const controllerDir = __dirname;

	// লোড করার সময় ফাইলগুলো যেন global.client.database খুঁজে পায়
	const threadsData = await require(path.join(controllerDir, "threadsData.js"))(databaseType, threadModel, api, (q, d) => d);
	const usersData = await require(path.join(controllerDir, "usersData.js"))(databaseType, userModel, api, (q, d) => d);
	const dashBoardData = await require(path.join(controllerDir, "dashBoardData.js"))(databaseType, dashBoardModel, (q, d) => d);
	const globalData = await require(path.join(controllerDir, "globalData.js"))(databaseType, globalModel, (q, d) => d);

	global.db = { ...global.db, threadsData, usersData, dashBoardData, globalData, sequelize };

	return { threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData, sequelize };
};
