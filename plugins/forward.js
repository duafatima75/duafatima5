// ꜰᴀᴛɪᴍᴀ-ᴍᴅ

import { fileURLToPath } from 'url';
import { generateWAMessageFromContent } from '@whiskeysockets/baileys';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

cmd({
  pattern: "forward",
  alias: ["frd", "fwd"],
  desc: "Forward messages to groups using WhatsApp native method",
  category: "owner",
  react: "📤",
  filename: __filename
}, async (client, message, match, { isCreator, reply, from }) => {
  try {
    if (!isCreator) return await reply(
      `╔════════════════════════╗\n` +
      `║   👑 FATIMA-MD OWNER   👑   \n` +
      `╚════════════════════════╝\n\n` +
      `❌ *Owner Only Command!*\n\n` +
      `> ⚡ *Version:* \`12.00\``
    );
    
    if (!message.quoted) return await reply(
      `╔════════════════════════╗\n` +
      `║   📤 FATIMA-MD FORWARD 📤   \n` +
      `╚════════════════════════╝\n\n` +
      `⚠️ *Please reply to a message to forward!*\n\n` +
      `> ⚡ *Version:* \`12.00\``
    );

    let jidInput = "";
    if (typeof match === "string") {
      jidInput = match.trim();
    } else if (Array.isArray(match)) {
      jidInput = match.join(" ").trim();
    } else if (match && typeof match === "object") {
      jidInput = match.text || "";
    }
    
    if (!jidInput) {
      return await reply(
        `╔════════════════════════╗\n` +
        `║   📤 FATIMA-MD FORWARD 📤   \n` +
        `╚════════════════════════╝\n\n` +
        `📌 *Usage:* \`.forward jid1,jid2,...\`\n\n` +
        `> 💡 *Example:* \`.forward 120363411055156472@g.us\`\n` +
        `> ⚡ *Version:* \`12.00\`\n` +
        `> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`
      );
    }

    const rawJids = jidInput.split(',').map(jid => jid.trim()).filter(jid => jid);
    const validJids = rawJids
      .map(jid => {
        if (jid.includes('@')) {
          if (jid.endsWith('@g.us') || jid.endsWith('@s.whatsapp.net') || jid.endsWith('@newsletter')) {
            const numbers = jid.match(/\d+/g);
            if (!numbers || numbers.length === 0) return null;
            
            if (jid.endsWith('@g.us')) {
              return `${numbers.join('')}@g.us`;
            } else if (jid.endsWith('@s.whatsapp.net')) {
              return `${numbers.join('')}@s.whatsapp.net`;
            } else if (jid.endsWith('@newsletter')) {
              return `${numbers.join('')}@newsletter`;
            }
          }
          return null;
        } else if (/^\d+$/.test(jid)) {
          return `${jid}@g.us`;
        }
        return null;
      })
      .filter(jid => jid !== null)
      .slice(0, 50);

    if (validJids.length === 0) {
      return await reply("❌ *No valid JIDs found!*");
    }

    const uniqueJids = [...new Set(validJids)];
    
    await reply(`🔄 *Forwarding to ${uniqueJids.length} chats...*`);

    let successCount = 0;
    const failedJids = [];

    const quotedContent = message.msg?.contextInfo?.quotedMessage;
    
    if (!quotedContent) {
      return await reply("❌ *Could not extract quoted message content!*");
    }

    const messageContent = { ...quotedContent };

    for (const [index, jid] of uniqueJids.entries()) {
      try {
        const forwardData = generateWAMessageFromContent(
          jid,
          messageContent,
          { userJid: client.user.id }
        );

        await client.relayMessage(jid, forwardData.message, {
          messageId: forwardData.key.id
        });

        successCount++;
        
        if ((index + 1) % 5 === 0 && uniqueJids.length > 5) {
          await reply(`📤 *Sent to ${index + 1}/${uniqueJids.length} chats...*`);
        }
        
        if (index < uniqueJids.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
      } catch (error) {
        console.error(`Forward error to ${jid}:`, error.message);
        failedJids.push({
          jid: jid.includes('@g.us') ? jid.replace('@g.us', '') : 
               jid.includes('@s.whatsapp.net') ? jid.replace('@s.whatsapp.net', '') :
               jid.replace('@newsletter', ''),
          error: error.message.substring(0, 30)
        });
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    const contentType = Object.keys(quotedContent)[0] || 'unknown';
    const groupCount = uniqueJids.filter(jid => jid.endsWith('@g.us')).length;
    const personalCount = uniqueJids.filter(jid => jid.endsWith('@s.whatsapp.net')).length;
    const newsletterCount = uniqueJids.filter(jid => jid.endsWith('@newsletter')).length;

    let report = `
╔════════════════════════╗
║  ✅ FATIMA-MD FORWARD  ✅  
╚════════════════════════╝
 📤 *Success:* \`${successCount}/${uniqueJids.length}\`
 📦 *Content Type:* \`${contentType.replace('Message', '')}\`
 👥 *Groups:* \`${groupCount}\`
 👤 *Personal:* \`${personalCount}\`
 📰 *Newsletters:* \`${newsletterCount}\`
━━━━━━━━━━━━━━━━━━━━━━━━━━`.trim();
    
    if (failedJids.length > 0) {
      report += `\n❌ *Failed (${failedJids.length}):*\n`;
      failedJids.slice(0, 3).forEach(f => {
        report += `• ${f.jid}: ${f.error}\n`;
      });
      if (failedJids.length > 3) report += `... +${failedJids.length - 3} more\n`;
    }
    
    if (rawJids.length > uniqueJids.length) {
      report += `\n⚠️ *Removed ${rawJids.length - uniqueJids.length} invalid/duplicate JIDs*\n`;
    }

    report += `\n> ⚡ *Version:* \`12.00\`\n> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`;

    await reply(report);

  } catch (error) {
    console.error("Forward Error:", error);
    await reply(`❌ *Error:* ${error.message.substring(0, 100)}`);
  }
});
