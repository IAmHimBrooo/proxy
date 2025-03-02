const noblox = require("noblox.js");
const axios = require("axios");

async function getGamePassesWithDelay(gameIds) {
    let gamepassIds = [];

    for (const game of gameIds) {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            var passes = await noblox.getGamePasses(game.id, 100)
            gamepassIds = [...gamepassIds, ...passes];

        } catch (error) {
            console.error(`❌ Failed to fetch passes for ${game.name}:`, error.message);
        }
    }
    gamepassIds = gamepassIds.filter((element) => element.price !== null)
    return gamepassIds;
}

async function getUserCreatedClothing(userId, assetTypeId) {
    let results = [];
    let cursor = "";
    try {
        let done = false;
        while (!done) {
            const url = `https://catalog.roblox.com/v1/search/items/details?Category=Clothing&CreatorTargetId=${userId}&CreatorType=User&Limit=30&SortType=RecentlyUpdated&AssetType=${assetTypeId}&cursor=${cursor}`;
            
            const response = await axios.get(url);
            results = results.concat(response.data.data);
            
            if (response.data.nextPageCursor) {
                cursor = response.data.nextPageCursor; // Move to the next page
            } else {
                done = true; // No more pages
            }
        }
    } catch (error) {
        console.error(`❌ Failed to fetch user-created clothing:`, error.message);
    }
    return results;
}
module.exports.loadClothing = async (userId) => {
    const tshirts = await getUserCreatedClothing(userId, 2); 
    const shirts = await getUserCreatedClothing(userId, 11); 
    const pants = await getUserCreatedClothing(userId, 12);  
    return [tshirts, pants, shirts]
}

module.exports.loadGamepasses = async (userId) => {
    let gameIds = [];
    let cursor = "";
    try {
        let done = false;
        while (!done) {
            const url = `https://games.roblox.com/v2/users/${userId}/games?accessFilter=Public&limit=50&cursor=${cursor}`;
            
            const response = await axios.get(url);
            gameIds = gameIds.concat(response.data.data);
            
            if (response.data.nextPageCursor) {
                cursor = response.data.nextPageCursor; 
            } else {
                done = true; 
            }
        }

        if (!gameIds.length) {
            console.log("No games found.");
            return [];
        }
        
        return await getGamePassesWithDelay(gameIds);
    } catch (error) {
        console.error("❌ Failed to fetch game list:", error.message);
        return [];
    }
}
