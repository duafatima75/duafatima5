// ꜰᴀᴛɪᴍᴀ-ᴍᴅ

import { fileURLToPath } from 'url';
import axios from 'axios';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "ai",
    desc: "Ask anything to AI chatbot with FATIMA-MD style",
    category: "ai",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, reply }) => {
    try {
        if (!q) {
            return reply(
                `╔════════════════════════╗\n` +
                `║   🤖 FATIMA-MD AI CHAT 🤖   \n` +
                `╚════════════════════════╝\n\n` +
                `❌ *Kripya apna sawal ya prompt dein!*\n\n` +
                `> 📌 *Example:* \`.ai write a short poem about coding\`\n` +
                `> ⚡ *Version:* \`12.00\``
            );
        }

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        const url = `https://api.princetechn.com/api/ai/ai?apikey=prince&q=${encodeURIComponent(q)}`;
        const response = await axios.get(url, { timeout: 60000 });
        
        if (response.data) {
            let aiResult = response.data;

            if (typeof aiResult === 'object') {
                aiResult = aiResult.result || aiResult.response || aiResult.ai || JSON.stringify(aiResult, null, 2);
            }

            const aiBox = `
╔════════════════════════╗
║   🤖 FATIMA-MD AI CHAT 🤖   \n` +
            `╚════════════════════════╝\n` +
            ` ${aiResult}\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `> ⚡ *Version:* \`12.00\`\n` +
            `> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`.trim();

            await reply(aiBox, {
                contextInfo: { 
                    forwardingScore: 999, 
                    isForwarded: true, 
                    forwardedNewsletterMessageInfo: { 
                        newsletterJid: '120363412031212190@newsletter', 
                        newsletterName: 'ꜰᴀᴛɪᴍᴀ-ᴍᴅ ᴏғғɪᴄɪᴀʟ', 
                        serverMessageId: 143 
                    } 
                }
            });

            await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        } else {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply("❌ *AI API se koi jawab nahi mila!*");
        }

    } catch (e) {
        console.error("AI Command Error:", e);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        return reply(`❌ *Error occurred:* \`\`\`${e.message}\`\`\``);
    }
});
