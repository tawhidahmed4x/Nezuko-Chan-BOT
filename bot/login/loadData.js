const path = require('path');
const { log, colors } = global.utils;

module.exports = async function (api) {
    console.log(colors.hex("#00FFFF")(" 🔄 [DATABASE] TawHid_Bbz, memories loading..."));
    
    try {
        const controllerPath = path.join(process.cwd(), '/database/controller/index.js');
        // Separating require to avoid any potential TypeError
        const controllerFunc = require(controllerPath);
        await controllerFunc(api);
        
        console.log(colors.hex("#33FF33")(" ✅ [DATABASE] All Data Loaded Successfully!"));
    } catch (err) {
        console.error(err);
        throw err;
    }
};
