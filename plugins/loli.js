// ꜰᴀᴛɪᴍᴀ-ᴍᴅ

import { fileURLToPath } from 'url';
import axios from 'axios';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "loli",
    desc: "Get random anime neko images with FATIMA-MD styling",
    category: "anime",
    react: "🐱",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, reply }) => {
    try {
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        const url = "https://api.princetechn.com/api/anime/loli?apikey=prince";
        const response = await axios.get(url, { timeout: 60000 });
        
        let imageUrl = response.data.url || response.data.result || response.data.link;

        const captionBox = `
╔════════════════════════╗
║   🐱 FATIMA-MD ANIME   🐱   \n` +
        `╚════════════════════════╝\n` +
        ` 🌸 *Category:* \`Anime Neko\`\n` +
        ` 🚀 *Status:* \`Successfully Fetched\`\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `> ⚡ *Version:* \`12.00\`\n` +
        `> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`.trim();

        if (imageUrl) {
            await conn.sendMessage(from, { 
                image: { url: imageUrl }, 
                caption: captionBox
            }, { quoted: mek });
        } else {
            await conn.sendMessage(from, { 
                image: { url: url }, 
                caption: captionBox
            }, { quoted: mek });
        }

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error("Loli Command Error:", e);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        return reply(`❌ *Error:* ${e.message}`);
    }
});
