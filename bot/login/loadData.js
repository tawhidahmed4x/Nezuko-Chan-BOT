const path = require('path');
const { log, colors } = global.utils;

module.exports = async function (api, createLine) {
    console.log(colors.hex("#00FFFF")(" 🔄 [DATABASE] TawHid_Bbz, memories loading..."));
    
    try {
        const controllerPath = path.join(process.cwd(), 'database/controller/index.js');
        const controller = require(controllerPath);
        await controller(api);
        
        log.info("DATABASE", "Threads and Users data loaded successfully.");
    } catch (err) {
        log.err('DATABASE', "Error during data loading:", err);
        throw err;
    }
};
