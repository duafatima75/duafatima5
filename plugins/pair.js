// ꜰᴀᴛɪᴍᴀ-ᴍᴅ

import { fileURLToPath } from 'url';
import axios from 'axios';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "pair",
    alias: ["pairing", "code", "connect"],
    desc: "Get pairing code for FATIMA-MD",
    category: "main",
    react: "🔗",
    filename: __filename
}, async (conn, mek, m, { from, args, q, reply }) => {
    try {
        if (!q) {
            return reply(
                `╔════════════════════════╗\n` +
                `║   🔗 FATIMA-MD PAIRING 🔗   \n` +
                `╚════════════════════════╝\n\n` +
                `❌ *Kripya apna WhatsApp number country code ke sath dein!*\n\n` +
                `> 📌 *Example:* \`.pair 923001234567\`\n` +
                `> ⚡ *Version:* \`12.00\``
            );
        }

        let phoneNumber = q.replace(/[^0-9]/g, '');
        if (!phoneNumber) {
            return reply("❌ *Invalid phone number! Kripya sahi number dein.*");
        }

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        // Fix: Changed endpoint path from /pair to /code based on server routing error (Cannot GET /pair)
        const apiUrl = `https://fatima-md-0b8680231a84.herokuapp.com/code?number=${phoneNumber}`;
        const { data } = await axios.get(apiUrl, { timeout: 30000 });

        const code = data.code || data.pairingCode || data.result;

        if (!code) {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply("❌ *Pairing code generate nahi ho saka. Dobara koshish karein!*");
        }

        const pairBox = `
╔════════════════════════╗
║   🔗 FATIMA-MD PAIRING 🔗   
╚════════════════════════╝
 📱 *Number:* \`+${phoneNumber}\`
 🔑 *Pairing Code:* \`${code}\`
━━━━━━━━━━━━━━━━━━━━━━━━━━
> ⚡ *Version:* \`12.00\`
> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`.trim();

        await reply(pairBox, {
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

    } catch (e) {
        console.error("Pair Command Error:", e);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply(`❌ *Error:* \`\`\`${e.message}\`\`\``);
    }
});
