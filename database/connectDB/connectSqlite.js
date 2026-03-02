const { Sequelize } = require("sequelize");
const path = require("path");

module.exports = async function () {
    const sqlitePath = path.join(__dirname, "..", "data/data.sqlite");
    const sequelize = new Sequelize({
        dialect: "sqlite",
        host: sqlitePath,
        logging: false
    });

    try {
        const threadModel = require("../models/sqlite/thread.js")(sequelize);
        const userModel = require("../models/sqlite/user.js")(sequelize);
        const dashBoardModel = require("../models/sqlite/userDashBoard.js")(sequelize);
        const globalModel = require("../models/sqlite/global.js")(sequelize);

        await sequelize.sync({ force: false });

        return {
            threadModel,
            userModel,
            dashBoardModel,
            globalModel,
            sequelize
        };
    } catch (e) {
        // যদি মডেল ফাইলগুলো না থাকে তাও যেন বট ক্রাশ না করে
        return { threadModel: {}, userModel: {}, dashBoardModel: {}, globalModel: {}, sequelize };
    }
};
