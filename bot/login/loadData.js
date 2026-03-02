const path = require('path');
const { log, colors } = global.utils;

module.exports = async function (api, createLine) {
    console.log(colors.hex("#00FFFF")(" 🔄 [DATABASE] TawHid_Bbz, memories loading..."));
    
    try {
        // Main directory theke database/controller/index.js load kora hocche
        const controllerPath = path.join(process.cwd(), 'database/controller/index.js');
        const controller = require(controllerPath);
        
        // Controller function call
        await controller(api);
        
        console.log(colors.hex("#33FF33")(` ✅ [THREADS] ${global.db.allThreadData.length} Groups Loaded.`));
        console.log(colors.hex("#33FF33")(` ✅ [USERS] ${global.db.allUserData.length} Users Loaded.`));
    } catch (err) {
        log.err('DATABASE', "Error during data loading:", err);
        throw err;
    }
};
