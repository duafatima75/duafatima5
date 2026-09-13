// DR KAMRAN 

import { fileURLToPath } from 'url';
import axios from 'axios';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "playstore",
    desc: "Search applications on Play Store",
    category: "search",
    react: "📱",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, reply }) => {
    try {
        if (!q) {
            return reply(
                `╔════════════════════════╗\n` +
                `║   📱 KAMRAN-MD PLAYSTORE 📱   \n` +
                `╚════════════════════════╝\n\n` +
                `❌ *Kripya Play Store search ke liye app ka naam dein!*\n\n` +
                `> 📌 *Example:* \`.playstore WhatsApp\`\n` +
                `> ⚡ *Version:* \`12.00\``
            );
        }

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        const url = `https://api.princetechn.com/api/search/playstore?apikey=prince&query=${encodeURIComponent(q)}`;
        const response = await axios.get(url, { timeout: 60000 });
        
        if (response.data) {
            let apps = [];
            
            if (response.data.results && Array.isArray(response.data.results)) {
                apps = response.data.results;
            } else if (Array.isArray(response.data)) {
                apps = response.data;
            } else if (response.data.result && Array.isArray(response.data.result)) {
                apps = response.data.result;
            } else if (response.data.data && Array.isArray(response.data.data)) {
                apps = response.data.data;
            }

            if (apps.length === 0) {
                await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
                return reply("❌ *Is query par koi app nahi mili!*");
            }

            const appInfo = apps[0];
            const appName = appInfo.name || appInfo.title || q;
            const appID = appInfo.appId || appInfo.package || "Unknown";
            const appDeveloper = appInfo.developer || appInfo.publisher || "Unknown";
            const appRating = appInfo.rating || appInfo.score || "N/A";
            const appLink = appInfo.url || appInfo.link || "";
            const appIcon = appInfo.icon || appInfo.image || "";

            const playStoreBox = `
╔════════════════════════╗
║   📱 PLAYSTORE SEARCH APP   
╚════════════════════════╝

📌 *App Name:* ${appName}
👤 *Developer:* ${appDeveloper}
⭐ *Rating:* ${appRating}
📦 *Package ID:* \`${appID}\`
🔗 *Link:* ${appLink}

> ⚡ *Version:* \`12.00\`
> 👑 *Powered by DOCTOR MD*`.trim();

            if (appIcon) {
                await conn.sendMessage(from, { 
                    image: { url: appIcon }, 
                    caption: playStoreBox 
                }, { quoted: mek });
            } else {
                await reply(playStoreBox, {
                    contextInfo: { 
                        forwardingScore: 999, 
                        isForwarded: true, 
                        forwardedNewsletterMessageInfo: { 
                            newsletterJid: '1203634120312190@newsletter', 
                            newsletterName: 'DR KAMRAN', 
                            serverMessageId: 143 
                        } 
                    }
                });
            }

            await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        } else {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply("❌ *API se koi response nahi mila!*");
        }

    } catch (e) {
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        return reply("❌ *Kuch galat ho gaya, kripya thodi der baad koshish karein!*");
    }
});
