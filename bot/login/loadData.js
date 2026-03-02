const path = require('path');
const { log, colors } = global.utils;

module.exports = async function (api) {
    console.log(colors.hex("#00FFFF")(" 🔄 [DATABASE] TawHid_Bbz, memories loading..."));
    
    try {
        // PATH: সরাসরি database/controller/index.js
        const controllerPath = path.join(process.cwd(), 'database/controller/index.js');
        const controller = require(controllerPath);
        await controller(api);
        
        console.log(colors.hex("#33FF33")(" ✅ [DATABASE] Data Loaded Successfully!"));
    } catch (err) {
        console.error("Path Error:", err);
        throw err;
    }
};
