// ꜰᴀᴛɪᴍᴀ-ᴍᴅ

import { fileURLToPath } from 'url';
import axios from 'axios';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "tiktokboost",
    alias: ["ttboost", "boosttiktok"],
    desc: "Boost TikTok video views and likes with FATIMA-MD style",
    category: "downloader",
    react: "🎯",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, reply, usedPrefix }) => {
    try {
        if (!q) {
            return reply(
                `╔════════════════════════╗\n` +
                `║   🤖 TIKTOK BOOSTER 🤖    \n` +
                `╚════════════════════════╝\n\n` +
                `❌ *Kripya TikTok video ka URL dein!*\n\n` +
                `> 📌 *Example:* \`${usedPrefix + command} https://www.tiktok.com/@username/video/123456789\`\n` +
                `> ⚡ *Version:* \`12.00\``
            );
        }

        const urlMatch = q.match(/(https?:\/\/[^\s]+)/i);
        if (!urlMatch) {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply("❌ *Invalid URL. Please provide a valid TikTok video link.*");
        }

        const tiktokUrl = urlMatch[0];

        if (!tiktokUrl.includes('tiktok.com')) {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply("❌ *Please provide a valid TikTok URL.*");
        }

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        await reply(`🔄 *Processing your request...*\n\n📱 Boosting TikTok video:\n${tiktokUrl}`);

        const apiUrl = `https://omegatech-api.dixonomega.tech/api/Fun/Tiktok-booster?action=boost&url=${encodeURIComponent(tiktokUrl)}`;
        
        const response = await axios.get(apiUrl, {
            timeout: 30000
        });

        if (!response.data.success) {
            throw new Error('API request failed');
        }

        const data = response.data.data;
        const timestamp = new Date(response.data.timestamp).toLocaleString();

        const successBox = `
╔════════════════════════╗
║   🤖 TIKTOK BOOSTER 🤖    
╚════════════════════════╝

🎯 *TIKTOK BOOSTER SUCCESS*

━━━━━━━━━━━━━━━━━━━━━
📹 *Title:* ${data.title || 'Not available'}
👤 *Author:* ${data.author || 'Unknown'}
🔗 *Username:* @${data.username || 'Unknown'}
📊 *Status:* ${data.status || 'Processing'}
━━━━━━━━━━━━━━━━━━━━━

📝 *Note:* The likes and views take time to register.

🕐 *Timestamp:* ${timestamp}
🔹 *Source:* ${response.data.source || 'Omegatech'}
🔹 *Attribution:* ${response.data.attribution || '@Omegatech-01'}
━━━━━━━━━━━━━━━━━━━━━━━━━━
> ⚡ *Version:* \`12.00\`
> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`.trim();

        await reply(successBox);
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (error) {
        console.error('TikTok Booster Error:', error);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        
        let errorMsg = '❌ *Failed to boost TikTok video*\n\n';
        if (error.response) {
            errorMsg += `📌 Status: ${error.response.status}\n`;
            errorMsg += `📌 Error: ${error.response.data?.message || 'Unknown error'}`;
        } else if (error.request) {
            errorMsg += `📌 No response from server. Please try again later.`;
        } else {
            errorMsg += `📌 Error: ${error.message}`;
        }
        
        await reply(errorMsg);
    }
});
