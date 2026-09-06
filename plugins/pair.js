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

        await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

        const apiUrl = `https://fatima-md-0b8680231a84.herokuapp.com/pair?phone=${phoneNumber}`;
        const { data } = await axios.get(apiUrl, { timeout: 30000 });

        const code = data.code || data.pairingCode || data.result;

        if (!code) {
            await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
            return reply("❌ *Pairing code generate nahi ho saka. Dobara koshish karein!*");
        }

        const pairBox = `
╔════════════════════════╗\n` +
        `║   🔗 FATIMA-MD PAIRING 🔗   \n` +
        `╚════════════════════════╝\n` +
        ` 📱 *Number:* \`+${phoneNumber}\`\n` +
        ` 🔑 *Pairing Code:* \`${code}\`\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `> ⚡ *Version:* \`12.00\`\n` +
        `> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`.trim();

        await reply(pairBox);
        await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

    } catch (e) {
        console.error("Pair Command Error:", e);
        await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
        reply(`❌ *Error:* \`\`\`${e.message}\`\`\``);
    }
});
