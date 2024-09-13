const log = require('../config/log');
const cryptoService = require('../services/cypto.service');

/**
 * Fetch and display profile data.
 * 
 * This function retrieves data for the specified token and sends a formatted message
 * back to the user with the token's details. If an error occurs, a friendly error message is sent.
 */
exports.getProfileData = async (msg, bot, tokenName) => {
    const chatId = msg['chat']['id'];

    try {
        log.START(`💾⚡ Loading data for investment profile: ${tokenName} by chat ID: ${chatId} 💾⚡`);

        if (!tokenName) return bot.sendMessage(chatId, '🚨🚫 Please provide a profile name. Usage: /get_token <profile_name> 🚨🚫');

        const tokenData = await cryptoService.getTokenData(tokenName.toLowerCase());

        if (tokenData['error']) return bot.sendMessage(chatId, `🚨🚫 Sorry, we're unable to retrieve data for ${tokenName} at the moment. Please try again later 🚨🚫`);
        else {
            const TOKEN_NAME = tokenName.charAt(0).toUpperCase() + tokenName.slice(1);
            log.SUCCESS(`✅✨ Successfully fetched data for token: ${TOKEN_NAME} by chat ID: ${chatId} ✅✨`);
            return bot.sendMessage(chatId,
                `🌟 *${TOKEN_NAME} Overview* 🌟\n\n` +
                `\`\`\`\n` +
                ` Property                | Value            \n` +
                `-------------------------|------------------\n` +
                ` 💰 Current Price:       | $${tokenData?.['price']}\n` +
                ` 🏦 Market Cap:          | $${tokenData?.['marketCap']}\n` +
                ` 🔄 24h Volume:          | $${tokenData?.['volume24h']}\n` +
                ` 📈 Price Change (24h):  | ${tokenData?.['priceChange24h']}%\n` +
                ` 📉 Price Change % 24h:  | ${tokenData?.['priceChangePercentage24h']}%\n` +
                ` 📊 Market Cap Change 24h| $${tokenData?.['marketCapChange24h']}\n` +
                ` 📉 Mkt Cap Change % 24h | ${tokenData?.['marketCapChangePercentage24h']}%\n` +
                `\`\`\`\n` +
                `🔍 _Stay updated with ${TOKEN_NAME}!_`
                , { parse_mode: 'Markdown' });
        }
    } catch (error) {
        log.ERROR(`Unexpected error occurred while fetching data for token: ${tokenName} by chat ID: ${chatId}`, error);
        return bot.sendMessage(chatId, '❌🔴 Oops! There was an error retrieving the token data. Please try again. ❌🔴');
    }
};
