// ꜰᴀᴛɪᴍᴀ-ᴍᴅ

import { fileURLToPath } from 'url';
import axios from 'axios';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "sim",
    alias: ["simdb", "simdata"],
    desc: "Find SIM info with FATIMA-MD style",
    category: "tools",
    react: "💎",
    filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
    try {
        if (!q) {
            return reply(
                `╔════════════════════════╗\n` +
                `║   💎 FATIMA-MD SIM DB  💎   \n` +
                `╚════════════════════════╝\n\n` +
                `❌ *Kripya phone number dein!*\n\n` +
                `> 📌 *Example:* \`.sim 0303xxxxxxx\`\n` +
                `> ⚡ *Version:* \`12.00\``
            );
        }

        let raw = q.replace(/\D/g, '');
        if (raw.startsWith('92')) raw = '0' + raw.slice(2);
        if (raw.length < 10 || raw.length > 11) {
            return reply("❌ *Invalid number format! Please enter a valid 11-digit number.*");
        }

        const api = `https://fam-official.serv00.net/api/database.php?number=${raw}`;

        await conn.sendMessage(from, {
            react: { text: "🔍", key: m.key }
        });

        const { data: resp } = await axios.get(api, { timeout: 20000 });

        if (!resp?.success || !resp?.data?.records?.length) {
            await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
            return reply("❌ *No Record Found for this number!*");
        }

        const record = resp.data.records[0];

        const name = record.full_name || "N/A";
        const cnic = record.cnic || "N/A";
        const address = record.address || "N/A";
        const phone = record.phone || raw;

        const simBox = `
╔════════════════════════╗
║   💎 FATIMA-MD SIM DB  💎   \n` +
        `╚════════════════════════╝\n` +
        ` 👤 *NAME:* \`${name}\`\n` +
        ` 🪪 *CNIC:* \`${cnic}\`\n` +
        ` 📍 *ADDR:* \`${address}\`\n` +
        ` 📞 *NUM:* \`${phone}\`\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `> ⚡ *Version:* \`12.00\`\n` +
        `> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`.trim();

        await reply(simBox, {
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

        await conn.sendMessage(from, {
            react: { text: "✅", key: m.key }
        });

    } catch (e) {
        console.error("SIM CMD ERROR:", e);
        await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
        reply("❌ *Internal Error occurred while fetching SIM data.*");
    }
});
