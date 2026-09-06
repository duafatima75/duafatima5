// ꜰᴀᴛɪᴍᴀ-ᴍᴅ

import { cmd } from '../command.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "block",
    desc: "Blocks a person with FATIMA-MD style",
    category: "owner",
    react: "🚫",
    filename: __filename
},
async (conn, m, { reply, q, react, isCreator }) => {
    if (!isCreator) {
        await react("❌");
        return reply(
            `╔════════════════════════╗\n` +
            `║   👑 FATIMA-MD OWNER   👑   \n` +
            `╚════════════════════════╝\n\n` +
            `❌ *Only the bot owner can use this command!*\n\n` +
            `> ⚡ *Version:* \`12.00\``
        );
    }

    let jid;
    if (m.quoted) {
        jid = m.quoted.sender;
    } else if (m.mentionedJid.length > 0) {
        jid = m.mentionedJid[0];
    } else if (q && q.includes("@")) {
        jid = q.replace(/[@\s]/g, '') + "@s.whatsapp.net";
    } else {
        await react("❌");
        return reply(
            `╔════════════════════════╗\n` +
            `║   🚫 FATIMA-MD BLOCK   🚫   \n` +
            `╚════════════════════════╝\n\n` +
            `⚠️ *Please mention a user or reply to their message!*\n\n` +
            `> ⚡ *Version:* \`12.00\`\n` +
            `> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`
        );
    }

    try {
        await conn.updateBlockStatus(jid, "block");
        await react("✅");
        
        const targetNumber = jid.split("@")[0];
        const successBox = `
╔════════════════════════╗\n` +
        `║   🚫 FATIMA-MD BLOCK   🚫   \n` +
        `╚════════════════════════╝\n` +
        ` 🛡️ *Status:* \`Successfully Blocked\`\n` +
        ` 👤 *User:* \`@${targetNumber}\`\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `> ⚡ *Version:* \`12.00\`\n` +
        `> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`.trim();

        reply(successBox, { mentions: [jid] });
    } catch (error) {
        console.error("Block command error:", error);
        await react("❌");
        reply("❌ *Failed to block the user due to an error.*");
    }
});

cmd({
    pattern: "unblock",
    desc: "Unblocks a person with FATIMA-MD style",
    category: "owner",
    react: "🔓",
    filename: __filename
},
async (conn, m, { reply, q, react, isCreator }) => {
    if (!isCreator) {
        await react("❌");
        return reply(
            `╔════════════════════════╗\n` +
            `║   👑 FATIMA-MD OWNER   👑   \n` +
            `╚════════════════════════╝\n\n` +
            `❌ *Only the bot owner can use this command!*\n\n` +
            `> ⚡ *Version:* \`12.00\``
        );
    }

    let jid;
    if (m.quoted) {
        jid = m.quoted.sender;
    } else if (m.mentionedJid.length > 0) {
        jid = m.mentionedJid[0];
    } else if (q && q.includes("@")) {
        jid = q.replace(/[@\s]/g, '') + "@s.whatsapp.net";
    } else {
        await react("❌");
        return reply(
            `╔════════════════════════╗\n` +
            `║   🔓 FATIMA-MD UNBLOCK 🔓   \n` +
            `╚════════════════════════╝\n\n` +
            `⚠️ *Please mention a user or reply to their message!*\n\n` +
            `> ⚡ *Version:* \`12.00\`\n` +
            `> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`
        );
    }

    try {
        await conn.updateBlockStatus(jid, "unblock");
        await react("✅");
        
        const targetNumber = jid.split("@")[0];
        const successBox = `
╔════════════════════════╗\n` +
        `║   🔓 FATIMA-MD UNBLOCK 🔓   \n` +
        `╚════════════════════════╝\n` +
        ` 🛡️ *Status:* \`Successfully Unblocked\`\n` +
        ` 👤 *User:* \`@${targetNumber}\`\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `> ⚡ *Version:* \`12.00\`\n` +
        `> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`.trim();

        reply(successBox, { mentions: [jid] });
    } catch (error) {
        console.error("Unblock command error:", error);
        await react("❌");
        reply("❌ *Failed to unblock the user due to an error.*");
    }
});
