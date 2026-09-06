// ꜰᴀᴛɪᴍᴀ-ᴍᴅ

import { fileURLToPath } from 'url';
import axios from 'axios';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "pinterest",
    alias: ["pin", "pinterestsearch", "pindl"],
    desc: "Search and download images from Pinterest with FATIMA-MD style",
    category: "search",
    react: "📌",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, args, q, reply }) => {
    try {
        if (!q || typeof q !== 'string' || !q.trim()) {
            return reply(
                `╔════════════════════════╗\n` +
                `║   📌 FATIMA-MD PINTEREST 📌 \n` +
                `╚════════════════════════╝\n\n` +
                `❌ *Kripya search query dein!*\n\n` +
                `> 📌 *Example:* \`.pinterest anime boy\`\n` +
                `> ⚡ *Version:* \`12.00\``
            );
        }

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        const endpointUrl = `https://api-xemoz-official.my.id/api/search/pinterest.php?q=${encodeURIComponent(q.trim())}`;

        const response = await axios.get(endpointUrl, { 
            timeout: 60000,
            validateStatus: () => true,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
        });

        let data = response.data;
        
        if (typeof data === 'string') {
            try {
                data = JSON.parse(data);
            } catch (e) {
                await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
                return reply("❌ *Server Error: Invalid JSON data format received.*");
            }
        }

        if (response.status === 200 && (data?.status === true || data?.status === 200)) {
            const results = data.result;

            if (!results || (Array.isArray(results) && results.length === 0)) {
                await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
                return reply("❌ *Koi image nahi mili is query ke mutabiq!*");
            }

            let imageUrl = "";
            let totalResults = 1;

            if (Array.isArray(results)) {
                totalResults = results.length;
                let firstItem = results[0];
                
                if (typeof firstItem === 'string') {
                    imageUrl = firstItem;
                } else if (typeof firstItem === 'object' && firstItem !== null) {
                    imageUrl = firstItem.url || firstItem.image || firstItem.link || firstItem.downloadUrl;
                }
            } else if (typeof results === 'string') {
                imageUrl = results;
            }

            if (!imageUrl) {
                await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
                return reply("❌ *Image stream extract karne mein nakami hui!*");
            }

            const captionBox = `
╔════════════════════════╗
║   📌 PINTEREST SEARCH  📌   
╚════════════════════════╝
 🔍 *Query:* \`${q.trim()}\`
 📊 *Total Found:* \`${totalResults} Images\`
 🚀 *Status:* \`Successfully Fetched\`
━━━━━━━━━━━━━━━━━━━━━━━━━━
> ⚡ *Version:* \`12.00\`
> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`.trim();

            await conn.sendMessage(from, { 
                image: { url: imageUrl }, 
                caption: captionBox,
                contextInfo: { 
                    mentionedJid: [m.sender], 
                    forwardingScore: 999, 
                    isForwarded: true, 
                    forwardedNewsletterMessageInfo: { 
                        newsletterJid: '120363412031212190@newsletter', 
                        newsletterName: 'ꜰᴀᴛɪᴍᴀ-ᴍᴅ ᴏғғɪᴄɪᴀʟ', 
                        serverMessageId: 143 
                    } 
                } 
            }, { quoted: mek });

            await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

        } else {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply(`❌ *Server Rejected:* ${data?.message || 'Pinterest API endpoint failed to respond properly.'}`);
        }

    } catch (error) {
        console.error("Pinterest Command Error:", error);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        try {
            return reply(`❌ *Pinterest System Fail:* ${error.message}`);
        } catch (innerError) {
            console.error("Critical error crash during reply handling", innerError);
        }
    }
});
