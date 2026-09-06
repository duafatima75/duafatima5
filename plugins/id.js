// ꜰᴀᴛɪᴍᴀ-ᴍᴅ

import { cmd } from '../command.js';

async function lidToPhone(conn, lid) {
    try {
        const pn = await conn.signalRepository.lidMapping.getPNForLID(lid);
        if (pn) {
            return cleanPN(pn);
        }
        return lid.split("@")[0];
    } catch (e) {
        return lid.split("@")[0];
    }
}

function cleanPN(pn) {
    return pn.split(":")[0];
}

cmd({
    pattern: "id",
    alias: ["chatid", "jid", "gjid", "channelid", "newsletter", "cid"],  
    desc: "Get various IDs (chat, user, group, or channel)",
    react: "⚡",
    category: "utility",
    filename: import.meta.url,
}, async (conn, mek, m, { 
    from, isGroup, reply, sender, fromMe, botNumber2
}) => {
    try {
        if (m.text && m.text.includes('whatsapp.com/channel/')) {
            const match = m.text.match(/whatsapp\.com\/channel\/([\w-]+)/);
            if (!match) return reply(
                `╔════════════════════════╗\n` +
                `║   🆔 FATIMA-MD ID      🆔   \n` +
                `╚════════════════════════╝\n\n` +
                `⚠️ *Invalid channel link format!*\n\n` +
                `> 📌 *Example:* \`https://whatsapp.com/channel/xxxxxxxxx\`\n` +
                `> ⚡ *Version:* \`12.00\``
            );

            const inviteId = match[1];
            let metadata;
            
            try {
                metadata = await conn.newsletterMetadata("invite", inviteId);
            } catch (e) {
                return reply("❌ *Failed to fetch channel metadata. Make sure the link is correct.*");
            }

            if (!metadata || !metadata.id) return reply("❌ *Channel not found or inaccessible.*");

            return reply(
                `╔════════════════════════╗\n` +
                `║   📰 CHANNEL ID        📰   \n` +
                `╚════════════════════════╝\n` +
                `🆔 *ID:* \`${metadata.id}\`\n` +
                `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                `> ⚡ *Version:* \`12.00\`\n` +
                `> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`
            );
        }

        if (isGroup) {
            const groupJID = from.includes('@g.us') ? from : `${from}@g.us`;
            return reply(
                `╔════════════════════════╗\n` +
                `║   👥 GROUP ID          👥   \n` +
                `╚════════════════════════╝\n` +
                `📌 *Group JID:* \`${groupJID}\`\n` +
                `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                `> ⚡ *Version:* \`12.00\`\n` +
                `> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`
            );
            
        } else {
            if (fromMe) {
                const botPN = botNumber2.split('@')[0];
                return reply(
                    `╔════════════════════════╗\n` +
                    `║   👤 USER ID           👤   \n` +
                    `╚════════════════════════╝\n` +
                    `📌 *Your ID:* \`${botPN}@s.whatsapp.net\`\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                    `> ⚡ *Version:* \`12.00\`\n` +
                    `> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`
                );
            } else {
                let senderPN = sender.split('@')[0];
                
                if (sender.includes('@lid')) {
                    senderPN = await lidToPhone(conn, sender);
                }
                
                return reply(
                    `╔════════════════════════╗\n` +
                    `║   👤 USER ID           👤   \n` +
                    `╚════════════════════════╝\n` +
                    `📌 *Your ID:* \`${senderPN}@s.whatsapp.net\`\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                    `> ⚡ *Version:* \`12.00\`\n` +
                    `> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`
                );
            }
        }

    } catch (e) {
        console.error("ID Command Error:", e);
        return reply(`❌ *Error:* ${e.message}`);
    }
});

cmd({
    pattern: "getlid",
    alias: ["lidonly", "lid", "mylid"],  
    desc: "Get your LID (@lid) directly without conversion",
    react: "🆔",
    category: "utility",
    filename: import.meta.url,
}, async (conn, mek, m, { 
    from, isGroup, reply, sender, fromMe, botNumber2, mentionUser
}) => {
    try {
        const mentionedUser = mentionUser ? mentionUser[0] : null;
        
        if (mentionedUser) {
            if (mentionedUser.includes('@lid')) {
                return reply(
                    `╔════════════════════════╗\n` +
                    `║   🆔 LID VIEWER        🆔   \n` +
                    `╚════════════════════════╝\n` +
                    `📌 *User LID:* \`${mentionedUser}\`\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                    `> ⚡ *Version:* \`12.00\`\n` +
                    `> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`
                );
            } else {
                return reply("⚠️ *Mentioned user is not in LID format.*");
            }
        }
        
        if (isGroup) {
            if (sender.includes('@lid')) {
                return reply(
                    `╔════════════════════════╗\n` +
                    `║   🆔 YOUR LID          🆔   \n` +
                    `╚════════════════════════╝\n` +
                    `📌 *Your LID:* \`${sender}\`\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                    `> ⚡ *Version:* \`12.00\`\n` +
                    `> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`
                );
            } else {
                return reply("⚠️ *You don't have a LID format in this chat.*");
            }
        } else {
            if (fromMe) {
                if (botNumber2.includes('@lid')) {
                    return reply(
                        `╔════════════════════════╗\n` +
                        `║   🆔 BOT LID           🆔   \n` +
                        `╚════════════════════════╝\n` +
                        `📌 *Bot LID:* \`${botNumber2}\`\n` +
                        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                        `> ⚡ *Version:* \`12.00\`\n` +
                        `> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`
                    );
                } else {
                    return reply(
                        `╔════════════════════════╗\n` +
                        `║   🆔 BOT NUMBER        🆔   \n` +
                        `╚════════════════════════╝\n` +
                        `📌 *Bot Number:* \`${botNumber2}\`\n` +
                        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                        `> ⚡ *Version:* \`12.00\`\n` +
                        `> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`
                    );
                }
            } else {
                if (sender.includes('@lid')) {
                    return reply(
                        `╔════════════════════════╗\n` +
                        `║   🆔 YOUR LID          🆔   \n` +
                        `╚════════════════════════╝\n` +
                        `📌 *Your LID:* \`${sender}\`\n` +
                        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                        `> ⚡ *Version:* \`12.00\`\n` +
                        `> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`
                    );
                } else {
                    return reply(`⚠️ *You don't have a LID format. Your current ID:* \`${sender}\``);
                }
            }
        }

    } catch (e) {
        console.error("GetLID Command Error:", e);
        return reply(`❌ *Error:* ${e.message}`);
    }
});
