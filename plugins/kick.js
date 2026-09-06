import { fileURLToPath } from 'url';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

const cleanId = (id) => id ? id.split('@')[0].split(':')[0] : '';

async function checkAdminStatus(conn, chatId, senderId) {
    try {
        const metadata = await conn.groupMetadata(chatId);
        const participants = metadata.participants || [];

        const botId = cleanId(conn.user?.id || '');
        const botLid = cleanId(conn.user?.lid || '');
        const sender = cleanId(senderId);

        let isBotAdmin = false;
        let isSenderAdmin = false;

        for (let p of participants) {
            if (p.admin === "admin" || p.admin === "superadmin") {
                const pId = cleanId(p.id);
                const pLid = cleanId(p.lid);
                const pPhone = p.phoneNumber ? cleanId(p.phoneNumber) : '';

                if (pId === botId || pLid === botLid || pPhone === botId) {
                    isBotAdmin = true;
                }

                if (pId === sender || pLid === sender || pPhone === sender) {
                    isSenderAdmin = true;
                }
            }
        }

        return { isBotAdmin, isSenderAdmin, participants };
    } catch (e) {
        console.error("Admin check error:", e);
        return { isBotAdmin: false, isSenderAdmin: false, participants: [] };
    }
}

cmd({
    pattern: "kick",
    alias: ["k"],
    desc: "Kick a member from group",
    category: "group",
    react: "👢",
    filename: __filename
},
async (conn, mek, m, { reply, react, isBotOwner, sender, from }) => {
    try {
        const msg = mek || m;
        const chatId = from || m.chat || msg.key.remoteJid;

        if (!chatId.endsWith("@g.us")) {
            return reply(
                `┏━━━❖ *👢 Gʀᴏᴜᴘ Aᴄᴛɪᴏɴ* ❖━━━┓\n` +
                `┃\n` +
                `┃ ❌ *This command can only be used in groups!*\n` +
                `┃\n` +
                `┗━━━━━━━━━━━━━━━━━━━━━━┛\n\n` +
                `> ⚡ *Version:* \`12.00\``
            );
        }

        const senderId = sender || msg.key.participant || msg.key.remoteJid;
        const { isBotAdmin, isSenderAdmin, participants } = await checkAdminStatus(conn, chatId, senderId);

        if (!isSenderAdmin && !isBotOwner) {
            return reply(
                `┏━━━❖ *👢 Aᴄᴄᴇss Dᴇɴɪᴇᴅ* ❖━━━┓\n` +
                `┃\n` +
                `┃ ❌ *Sirf group admins members ko kick kar sakte hain!*\n` +
                `┃\n` +
                `┗━━━━━━━━━━━━━━━━━━━━━━┛\n\n` +
                `> ⚡ *Version:* \`12.00\`\n` +
                `> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`
            );
        }

        if (!isBotAdmin) {
            return reply(
                `┏━━━❖ *👢 Bᴏᴛ Aᴄᴛɪᴏɴ* ❖━━━┓\n` +
                `┃\n` +
                `┃ ⚠️ *Mujhe admin banao pehle, tabhi main kisi ko kick kar sakta hoon!*\n` +
                `┃\n` +
                `┗━━━━━━━━━━━━━━━━━━━━━━┛\n\n` +
                `> ⚡ *Version:* \`12.00\`\n` +
                `> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`
            );
        }

        let usersToKick = [];
        const ctxInfo = msg.message?.extendedTextMessage?.contextInfo;
        
        if (ctxInfo?.mentionedJid?.length > 0) {
            usersToKick = ctxInfo.mentionedJid;
        } else if (ctxInfo?.participant) {
            usersToKick = [ctxInfo.participant];
        }

        if (!usersToKick || usersToKick.length === 0) {
            return reply(
                `┏━━━❖ *👢 Kɪᴄᴋ Mᴀᴛʀɪx* ❖━━━┓\n` +
                `┃\n` +
                `┃ ⚠️ *Please tag or reply to a user!*\n` +
                `┃ 📌 *Example:* \`.kick @user\`\n` +
                `┃\n` +
                `┗━━━━━━━━━━━━━━━━━━━━━━┛\n\n` +
                `> ⚡ *Version:* \`12.00\`\n` +
                `> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`
            );
        }

        const finalKickList = [];
        for (let target of usersToKick) {
            const cleanTarget = cleanId(target);
            
            const foundUser = participants.find(p => 
                cleanId(p.id) === cleanTarget || 
                cleanId(p.lid) === cleanTarget || 
                (p.phoneNumber && cleanId(p.phoneNumber) === cleanTarget)
            );

            if (foundUser) {
                const realJid = foundUser.id.includes('@') ? foundUser.id : `${cleanId(foundUser.id)}@s.whatsapp.net`;
                finalKickList.push(realJid);
            } else {
                finalKickList.push(target);
            }
        }

        await react("⏳");
        
        await conn.groupParticipantsUpdate(chatId, finalKickList, "remove");
        
        const targetNumber = cleanId(finalKickList[0]);
        const successText = `
┏━━━❖ *👢 Mᴇᴍʙᴇʀ Rᴇᴍᴏᴠᴇᴅ* ❖━━━┓
┃
┃ 🎯 *Target:* @${targetNumber}
┃ 🛡️ *Status:* \`Successfully Kicked\`
┃
┗━━━━━━━━━━━━━━━━━━━━━━┛

> ⚡ *Version:* \`12.00\`
> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`.trim();

        await conn.sendMessage(
            chatId,
            { 
                text: successText, 
                mentions: finalKickList,
                contextInfo: {
                    mentionedJid: [...finalKickList, senderId]
                }
            },
            { quoted: mek }
        );

        await react("✅");

    } catch (err) {
        console.error("Kick Error:", err);
        await react("❌");
        await reply(`❌ Error: ${err.message || "Member ko remove karne mein error aaya."}`);
    }
});
