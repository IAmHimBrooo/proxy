const noblox = require("noblox.js");
const axios = require("axios");

async function getGamePassesWithDelay(gameIds) {
    let gamepassIds = [];

    for (const game of gameIds) {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            var passes = await noblox.getGamePasses(game.id)
            gamepassIds = [...gamepassIds, ...passes];

        } catch (error) {
            console.error(`❌ Failed to fetch passes for ${game.name}:`, error.message);
        }
    }
    gamepassIds = gamepassIds.filter((element) => element.price !== null)
    return gamepassIds;
}

async function getUserCreatedClothing(userId, assetTypeId) {
    try {
        const url = `https://catalog.roblox.com/v1/search/items/details?Category=Clothing&CreatorTargetId=${userId}&CreatorType=User&Limit=30&SortType=RecentlyUpdated&AssetType=${assetTypeId}`;
        
        const response = await axios.get(url);
        return response.data.data;
    } catch (error) {
        console.error(`❌ Failed to fetch user-created clothing:`, error.message);
        return [];
    }
}

module.exports.loadClothing = async (userId) => {
    const tshirts = await getUserCreatedClothing(userId, 2); 
    const shirts = await getUserCreatedClothing(userId, 11); 
    const pants = await getUserCreatedClothing(userId, 12);  
    return [tshirts, pants, shirts]
}

module.exports.loadGamepasses = async (userId) => {
    try {
        const response = await axios.get(
            `https://games.roblox.com/v2/users/${userId}/games?accessFilter=Public&limit=50`
        );

        const gameIds = response.data.data;
        if (!gameIds.length) {
            console.log("No games found.");
            return;
        }
        const gamepassData = await getGamePassesWithDelay(gameIds);
        return gamepassData
    } catch (error) {
        console.error("❌ Failed to fetch game list:", error.message);
    }
}
