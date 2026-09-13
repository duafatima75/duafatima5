// DR KAMRAN 

import { fileURLToPath } from 'url';
import axios from 'axios';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "wallpaper",
    desc: "Search high quality wallpapers",
    category: "search",
    react: "🌄",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, reply }) => {
    try {
        if (!q) {
            return reply(
                `╔════════════════════════╗\n` +
                `║   🌄 KAMRAN-MD WALLPAPER 🌄   \n` +
                `╚════════════════════════╝\n\n` +
                `❌ *Kripya wallpaper search ke liye query dein!*\n\n` +
                `> 📌 *Example:* \`.wallpaper Sunset Scenes\`\n` +
                `> ⚡ *Version:* \`12.00\``
            );
        }

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        const url = `https://api.princetechn.com/api/search/wallpaper?apikey=prince&query=${encodeURIComponent(q)}`;
        const response = await axios.get(url, { timeout: 60000 });
        
        if (response.data) {
            let wallpapers = [];
            
            if (response.data.results && Array.isArray(response.data.results)) {
                wallpapers = response.data.results;
            } else if (Array.isArray(response.data)) {
                wallpapers = response.data;
            } else if (response.data.result && Array.isArray(response.data.result)) {
                wallpapers = response.data.result;
            } else if (response.data.data && Array.isArray(response.data.data)) {
                wallpapers = response.data.data;
            }

            if (wallpapers.length === 0) {
                await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
                return reply("❌ *Is query par koi wallpaper nahi mila, kuch aur search karein!*");
            }

            let rawUrl = wallpapers[0]?.image || wallpapers[0]?.url || wallpapers[0]?.link || wallpapers[0]?.img || (typeof wallpapers[0] === 'string' ? wallpapers[0] : '');

            if (!rawUrl || typeof rawUrl !== 'string') {
                await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
                return reply(`❌ *Wallpaper link extract nahi ho saka!*`);
            }

            // Agar comma-separated links hain toh unhein array me tod kar sabse pehla link saaf taur par lein
            const linksArray = rawUrl.split(',').map(link => link.trim());
            const wallpaperUrl = linksArray[0];

            if (!wallpaperUrl) {
                await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
                return reply(`❌ *Valid wallpaper URL nahi mila!*`);
            }

            const wpBox = `
╔════════════════════════╗
║   🌄 WALLPAPER SEARCH   
╚════════════════════════╝

🔍 *Query:* ${q}

> ⚡ *Version:* \`12.00\`
> 👑 *Powered by DOCTOR MD*`.trim();

            await conn.sendMessage(from, { 
                image: { url: wallpaperUrl }, 
                caption: wpBox 
            }, { quoted: mek });

            await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        } else {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply("❌ *API se koi response nahi mila!*");
        }

    } catch (e) {
        console.error("Wallpaper Command Error:", e);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        
        // Error ko style ke sath show karne ke liye KAMRAN-MD box format
        const errorBox = `
╔════════════════════════╗
║   ❌ WALLPAPER ERROR ❌   
╚════════════════════════╝

⚠️ *Error Details:* \`\`\`${e.message}\`\`\`

> ⚡ *Version:* \`12.00\`
> 👑 *Powered by DOCTOR MD*`.trim();

        return reply(errorBox);
    }
});
