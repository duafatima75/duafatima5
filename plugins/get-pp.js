// ꜰᴀᴛɪᴍᴀ-ᴍᴅ

import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import { lidToPhone, cleanPN } from '../lib/functions.js';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "getpp",
    alias: ["profile", "getdp"],
    react: "🚀",
    desc: "Sends the profile picture of a user by phone number, mention, or reply with FATIMA-MD style",
    category: "other",
    use: ".getpp <phone number> OR reply to a message OR mention someone",
    filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
    try {
        let targetJid = null;

        if ((!args || args.length === 0 || !args.join(" ").trim()) &&
            (!m.mentionedJid || m.mentionedJid.length === 0) &&
            !m.quoted) {
            return reply(
                `╔════════════════════════╗\n` +
                `║   🚀 FATIMA-MD GETPP   🚀   \n` +
                `╚════════════════════════╝\n\n` +
                `ℹ️ *Usage:*\n` +
                `• \`.getpp <phone number>\` (e.g., \`.getpp 923427582273\`)\n` +
                `• \`Reply to someone's message\`\n` +
                `• \`Mention someone (@user) in a group\`\n` +
                `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                `> ⚡ *Version:* \`12.00\`\n` +
                `> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`
            );
        }

        const argText = args.join(" ").trim();
        if (argText && argText.match(/[0-9]/)) {
            let phone = argText.replace(/[^0-9]/g, "");
            if (phone.length >= 8 && phone.length <= 15) {
                targetJid = phone + "@s.whatsapp.net";
            } else {
                return reply("❌ *Invalid phone number format. Please provide a valid number (8-15 digits).*");
            }
        }
        else if (m.mentionedJid && m.mentionedJid.length > 0) {
            targetJid = m.mentionedJid[0];
        }
        else if (m.quoted) {
            targetJid = m.quoted.sender;
        }

        if (!targetJid) {
            return reply(
                `╔════════════════════════╗\n` +
                `║   🚀 FATIMA-MD GETPP   🚀   \n` +
                `╚════════════════════════╝\n\n` +
                `ℹ️ *Usage:*\n` +
                `• \`.getpp <phone number>\` (e.g., \`.getpp 923427582273\`)\n` +
                `• \`Reply to someone's message\`\n` +
                `• \`Mention someone (@user) in a group\`\n` +
                `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                `> ⚡ *Version:* \`12.00\`\n` +
                `> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`
            );
        }

        if (targetJid.includes('@lid')) {
            try {
                let phoneNumber = await lidToPhone(conn, targetJid);
                if (phoneNumber && phoneNumber !== targetJid.split("@")[0]) {
                    targetJid = phoneNumber + "@s.whatsapp.net";
                }
            } catch (lidError) {
                console.log("LID conversion error:", lidError);
            }
        }

        if (!targetJid.includes('@')) {
            targetJid = targetJid + "@s.whatsapp.net";
        }

        let ppUrl;
        let userName = "User";
        
        try {
            ppUrl = await conn.profilePictureUrl(targetJid, "image");
            
            try {
                const contact = await conn.getContact?.(targetJid) || 
                               { notify: targetJid.split("@")[0], name: targetJid.split("@")[0] };
                userName = contact.notify || contact.vname || contact.name || targetJid.split("@")[0];
            } catch (contactError) {
                userName = targetJid.split("@")[0];
            }

            const captionBox = `
╔════════════════════════╗
║   🚀 PROFILE PICTURE   🚀   
╚════════════════════════╝
 👤 *User:* \`${userName}\`
 🚀 *Status:* \`Successfully Downloaded\`
━━━━━━━━━━━━━━━━━━━━━━━━━━
> ⚡ *Version:* \`12.00\`
> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`.trim();

            await conn.sendMessage(from, { 
                image: { url: ppUrl }, 
                caption: captionBox,
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

            await conn.sendMessage(from, { 
                react: { text: "✅", key: mek.key } 
            });

        } catch (fetchError) {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            if (fetchError.message?.includes("404") || fetchError.message?.includes("not found")) {
                return reply(`❌ *Profile picture not found for* \`${targetJid.split("@")[0]}\`\n\n*Reasons:* No DP set or privacy settings hide it.`);
            } else if (fetchError.message?.includes("401") || fetchError.message?.includes("unauthorized")) {
                return reply(`🔒 *Profile picture is private for* \`${targetJid.split("@")[0]}\`!`);
            } else {
                console.error("getpp fetch error:", fetchError);
                return reply(`❌ *Error fetching profile picture:* \`\`\`${fetchError.message || "Unknown error"}\`\`\``);
            }
        }

    } catch (e) {
        console.error("getpp command error:", e);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply("❌ *An error occurred while processing the command. Please try again later.*");
    }
});
