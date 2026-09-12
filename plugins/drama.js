// ꜰᴀᴛɪᴍᴀ-ᴍᴅ

import { fileURLToPath } from 'url';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

const URL_SADBOY = 'https://raw.githubusercontent.com/zxrow/Asupan/refs/heads/main/gabut/sadboy1.json';

let cache = [];
let lastFetch = 0;
const TTL = 5 * 60 * 1000;

async function getSadboy() {
    const now = Date.now();
    if (cache.length && now - lastFetch < TTL) return cache;
    const res = await fetch(URL_SADBOY);
    const json = await res.json();
    if (!Array.isArray(json)) return [];
    cache = json;
    lastFetch = now;
    return cache;
}

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

cmd({
    pattern: "sadboy",
    desc: "Get random sadboy quotes with FATIMA-MD style",
    category: "fun",
    react: "😔",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, reply }) => {
    try {
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        const list = await getSadboy();
        if (!list.length) {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply("❌ *Quote sadboy lagi kosong 😔*");
        }

        const quote = pickRandom(list);

        const sadboyBox = `
╔════════════════════════╗
║   🤖 FATIMA-MD SADBOY 🤖    
╚════════════════════════╝

 ${quote}

━━━━━━━━━━━━━━━━━━━━━━━━━━
> ⚡ *Version:* \`12.00\`
> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`.trim();

        await conn.sendMessage(from, { 
            text: sadboyBox,
            contextInfo: { 
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

    } catch (e) {
        console.error("Sadboy Command Error:", e);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        return reply(`❌ *Error occurred:* \`\`\`${e.message}\`\`\``);
    }
});
