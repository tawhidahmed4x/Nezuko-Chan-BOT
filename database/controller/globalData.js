module.exports = async function () {
    try {
        return [
            {
                key: "setalias",
                data: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                key: "analytics",
                data: {
                    ping: 2,
                    pair: 1,
                    help: 1,
                    prefix: 1
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
    } catch (err) {
        console.log("[GLOBAL DATA ERROR]:", err.message);
        return [];
    }
};
