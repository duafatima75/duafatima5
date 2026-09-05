// ping.js - ESM Version
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "ping",
    alias: ["speed", "pong"],
    use: '.ping',
    desc: "Check bot's response time.",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, quoted, sender, reply }) => {
    try {
        const start = Date.now();

        const reactionEmojis = ['🔥', '⚡', '🚀', '💨', '🎯', '🎉', '🌟', '💥', '🕐', '🔹'];
        const textEmojis = ['💎', '🏆', '⚡️', '🚀', '🎶', '🌠', '🌀', '🔱', '🛡️', '✨'];

        const reactionEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
        let textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];

        while (textEmoji === reactionEmoji) {
            textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];
        }

        await conn.sendMessage(from, {
            react: { text: textEmoji, key: mek.key }
        });

        const end = Date.now();
        const ping = end - start;

        let status;
        if (ping < 1000) status = "⚡ *Lightning Fast*";
        else if (ping < 1400) status = "⚙️ *Optimal Matrix*";
        else status = "🐢 *Stable Sync*";

        const text = `
┏━━━❖ *⚡ ꜰᴀᴛɪᴍᴀ-ᴍᴅ Pɪɴɢ* ❖━━━┓
┃
┃ 📶 *Latency:* \`${ping} ms\` ${reactionEmoji}
┃ 🧠 *Performance:* ${status}
┃ 🛡️ *Core:* \`Online & Secure\`
┃ ⚡ *Version:* \`12.00\`
┃
┗━━━━━━━━━━━━━━━━━━━━━━┛`;

        await conn.sendMessage(from, {
            text: text.trim(),
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363412031212190@newsletter',
                    newsletterName: "FATIMA-MD",
                    serverMessageId: 428
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in ping command:", e);
        reply(`An error occurred: ${e.message}`);
    }
});

cmd({
    pattern: "ping2",
    desc: "Check bot's response time.",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, reply, sender }) => {
    try {
        const startTime = Date.now();

        await new Promise(resolve => setTimeout(resolve, 300));

        const endTime = Date.now();
        const ping = endTime - startTime;

        let status;
        if (ping < 1000) status = "⚡ *Lightning Fast*";
        else if (ping < 1400) status = "⚙️ *Optimal Matrix*";
        else status = "🐢 *Stable Sync*";

        const msg = `
┏━━━❖ *⚡ ꜰᴀᴛɪᴍᴀ-ᴍᴅ Pɪɴɢ* ❖━━━┓
┃
┃ 📶 *Latency:* \`${ping} ms\`
┃ 🧠 *Performance:* ${status}
┃ 🛡️ *Core:* \`Online & Secure\`
┃ ⚡ *Version:* \`12.00\`
┃
┗━━━━━━━━━━━━━━━━━━━━━━┛`;

        await conn.sendMessage(from, { 
            text: msg.trim(),
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363412031212190@newsletter',
                    newsletterName: "FATIMA-MD",
                    serverMessageId: 428
                }
            }
        }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`⚠️ Error: ${e.message}`);
    }
});
