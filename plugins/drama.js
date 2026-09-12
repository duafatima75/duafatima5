// ꜰᴀᴛɪᴍᴀ-ᴍᴅ

import { fileURLToPath } from 'url';
import axios from 'axios';
import FormData from 'form-data';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "editimg",
    desc: "Edit photos using AI with FATIMA-MD style",
    category: "ai",
    react: "🎨",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, reply, usedPrefix }) => {
    try {
        const targetMsg = m.quoted ? m.quoted : m;
        const mime = (targetMsg.msg || targetMsg).mimetype || targetMsg.mediaType || '';

        let prompt = (q || '').trim();
        if (!prompt) prompt = 'Edit karakter ini jadi tersenyum';

        let imageUrl = null;

        if (/image/.test(mime)) {
            const media = await targetMsg.download();
            if (!media) {
                await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
                return reply("❌ *Gagal mengunduh media!*");
            }

            const form = new FormData();
            form.append('files[]', media, { filename: 'upload.' + mime.split('/')[1] });

            const upload = await axios.post('https://uguu.se/upload.php', form, {
                headers: form.getHeaders()
            });

            imageUrl = upload?.data?.files?.[0]?.url;
            if (!imageUrl) {
                await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
                return reply("❌ *Gagal upload ke Uguu!*");
            }
        } else {
            const urlMatch = (q || '').match(/https?:\/\/\S+/);
            if (urlMatch) {
                imageUrl = urlMatch[0];
                prompt = q.replace(imageUrl, '').trim() || prompt;
            }
        }

        if (!imageUrl) {
            return reply(
                `╔════════════════════════╗\n` +
                `║   🤖 FATIMA-MD EDITIMG 🤖   \n` +
                `╚════════════════════════╝\n\n` +
                `❌ *Kirim atau reply foto yang mau diedit dengan caption:*\n\n` +
                `> 📌 *Example:* \`${usedPrefix + command} Edit karakter ini jadi tersenyum\`\n` +
                `> ⚡ *Version:* \`12.00\``
            );
        }

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        await reply("⏳ *Tunggu sebentar, sedang mengedit foto...*");

        const apiUrl = `https://api-faa.my.id/faa/editfoto?url=${encodeURIComponent(imageUrl)}&prompt=${encodeURIComponent(prompt)}`;
        const res = await axios.get(apiUrl, {
            responseType: 'arraybuffer'
        });

        if (!res.data) {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply("❌ *Gagal mengedit foto!*");
        }

        await conn.sendMessage(from, {
            image: Buffer.from(res.data),
            caption: 
`╔════════════════════════╗
║   🤖 FATIMA-MD EDITIMG 🤖   
╚════════════════════════╝

✅ *Selesai mengedit foto ✨*

━━━━━━━━━━━━━━━━━━━━━━━━━━
> ⚡ *Version:* \`12.00\`
> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`
        }, { 
            quoted: mek,
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

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error("EditImg Command Error:", e);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        return reply(`❌ *Error occurred:* \`\`\`${e.message || e}\`\`\``);
    }
});
