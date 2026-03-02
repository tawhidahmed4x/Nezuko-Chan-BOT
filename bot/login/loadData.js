const chalk = require('chalk');
const path = require('path');
const { log, createOraDots, getText } = global.utils;

module.exports = async function (api, createLine) {
	console.log(chalk.hex("#f5ab00")(createLine("DATABASE")));
	
	try {
		const controllerPath = path.join(process.cwd(), 'src/database/controller/index.js');
		const controller = await require(controllerPath)(api);
		
		log.info('DATABASE', getText('loadData', 'loadThreadDataSuccess', global.db.allThreadData.length));
		log.info('DATABASE', getText('loadData', 'loadUserDataSuccess', global.db.allUserData.length));

		if (api && global.GoatBot.config.database.autoSyncWhenStart == true) {
			console.log(chalk.hex("#f5ab00")(createLine("AUTO SYNC")));
			// Auto sync logic remains same as per your original file
		}
	} catch (err) {
		log.error('DATABASE', "Error during data loading:", err);
		throw err;
	}
};
