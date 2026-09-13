// DR KAMRAN 

import { fileURLToPath } from 'url';
import axios from 'axios';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "img",
    desc: "Search images from Google Image search",
    category: "search",
    react: "🖼️",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, reply }) => {
    try {
        if (!q) {
            return reply(
                `╔════════════════════════╗\n` +
                `║   🖼️ KAMRAN-MD GOOGLE IMAGE 🖼️   \n` +
                `╚════════════════════════╝\n\n` +
                `❌ *Kripya image search ke liye query dein!*\n\n` +
                `> 📌 *Example:* \`.gimage Cute Cat\`\n` +
                `> ⚡ *Version:* \`12.00\``
            );
        }

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        const url = `https://api.princetechn.com/api/search/googleimage?apikey=prince&query=${encodeURIComponent(q)}`;
        const response = await axios.get(url, { timeout: 60000 });
        
        if (response.data) {
            const resData = response.data.result || response.data.data || response.data;
            
            // Extracting image list or single image URL based on API response structure
            let imageUrl = "";
            if (Array.isArray(resData)) {
                imageUrl = resData[0];
            } else if (typeof resData === 'object' && resData !== null) {
                imageUrl = resData.image || resData.url || resData.result?.[0] || resData[0];
            } else if (typeof resData === 'string') {
                imageUrl = resData;
            }

            if (!imageUrl) {
                await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
                return reply("❌ *Koi image nahi mili!*");
            }

            const imgBox = `
╔════════════════════════╗
║   🖼️ GOOGLE IMAGE SEARCH   
╚════════════════════════╝

🔍 *Query:* ${q}

> ⚡ *Version:* \`12.00\`
> 👑 *Powered by DOCTOR MD*`.trim();

            await conn.sendMessage(from, { 
                image: { url: imageUrl }, 
                caption: imgBox 
            }, { quoted: mek });

            await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        } else {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply("❌ *API se koi response nahi mila!*");
        }

    } catch (e) {
        console.error("Google Image Command Error:", e);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        return reply(`❌ *Error occurred:* \`\`\`${e.message}\`\`\``);
    }
});
