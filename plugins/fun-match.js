import { fileURLToPath } from 'url';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

// Command for random boy selection
cmd({
  pattern: "bacha",
  alias: ["boy", "larka"],
  desc: "Randomly selects a boy from the group",
  react: "👦",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, reply, sender }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups!");

    const groupMetadata = await conn.groupMetadata(from).catch(() => null);
    if (!groupMetadata || !groupMetadata.participants) {
      return reply("❌ Failed to fetch group participants!");
    }

    const participants = groupMetadata.participants;
    const eligible = participants.filter(p => !p.id.includes(conn.user.id.split('@')[0]));
    
    if (eligible.length < 1) return reply("❌ No eligible participants found!");

    const randomUser = eligible[Math.floor(Math.random() * eligible.length)];
    
    const text = `
┏━━━❖ *👦 Rᴀɴᴅᴏᴍ Bᴏʏ* ❖━━━┓
┃
┃ 🎯 *Selected:* @${randomUser.id.split('@')[0]}
┃ ✨ *Status:* \`Handsome Boy! 😎\`
┃
┗━━━━━━━━━━━━━━━━━━━━━━┛

> ⚡ *Version:* \`12.00\`
> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`;

    await conn.sendMessage(
      from,
      { 
        text: text.trim(), 
        mentions: [randomUser.id],
        contextInfo: {
          mentionedJid: [randomUser.id],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363412031212190@newsletter',
            newsletterName: "FATIMA-MD",
            serverMessageId: 428
          }
        }
      },
      { quoted: mek }
    );

  } catch (error) {
    console.error("FATIMA-MD Bacha Error:", error);
    reply(`❌ Error: ${error.message}`);
  }
});

// Command for random girl selection
cmd({
  pattern: "bachi",
  alias: ["girl", "kuri", "larki"],
  desc: "Randomly selects a girl from the group",
  react: "👧",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, reply, sender }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups!");

    const groupMetadata = await conn.groupMetadata(from).catch(() => null);
    if (!groupMetadata || !groupMetadata.participants) {
      return reply("❌ Failed to fetch group participants!");
    }

    const participants = groupMetadata.participants;
    const eligible = participants.filter(p => !p.id.includes(conn.user.id.split('@')[0]));
    
    if (eligible.length < 1) return reply("❌ No eligible participants found!");

    const randomUser = eligible[Math.floor(Math.random() * eligible.length)];
    
    const text = `
┏━━━❖ *👧 Rᴀɴᴅᴏᴍ Gɪʀʟ* ❖━━━┓
┃
┃ 🎯 *Selected:* @${randomUser.id.split('@')[0]}
┃ 💖 *Status:* \`Beautiful Queen! ✨\`
┃
┗━━━━━━━━━━━━━━━━━━━━━━┛

> ⚡ *Version:* \`12.00\`
> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`;

    await conn.sendMessage(
      from,
      { 
        text: text.trim(), 
        mentions: [randomUser.id],
        contextInfo: {
          mentionedJid: [randomUser.id],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363412031212190@newsletter',
            newsletterName: "FATIMA-MD",
            serverMessageId: 428
          }
        }
      },
      { quoted: mek }
    );

  } catch (error) {
    console.error("FATIMA-MD Bachi Error:", error);
    reply(`❌ Error: ${error.message}`);
  }
});
