const path = require('path');
const { log, colors } = global.utils;

module.exports = async function (api) {
    console.log(colors.hex("#00FFFF")(" 🔄 [DATABASE] Memories loading..."));
    
    try {
        const controllerPath = path.join(process.cwd(), 'database/controller/index.js');
        const controller = require(controllerPath);
        
        // Directly awaiting the controller
        await controller(api);
        
        log.info("DATABASE", "All Data Loaded Successfully!");
    } catch (err) {
        console.error(err);
        throw err;
    }
};
