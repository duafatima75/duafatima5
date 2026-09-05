import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "play",
    alias: ["ytplay", "song", "plays"],
    desc: "Search and download songs from YouTube via FAA API",
    category: "downloader",
    react: "🎵",
    filename: __filename
}, async (conn, mek, m, { from, text, reply, sender }) => {
    try {
        if (!text) {
            return reply(
                `┏━━━❖ *🎵 Yᴛ-Pʟᴀʏ Mᴀᴛʀɪx* ❖━━━┓\n` +
                `┃\n` +
                `┃ ⚠️ *Please provide a query!*\n` +
                `┃ 📌 *Example:* \`.play song pal\`\n` +
                `┃\n` +
                `┗━━━━━━━━━━━━━━━━━━━━━━┛\n\n` +
                `> ⚡ *Version:* \`12.00\``
            );
        }

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        const encodedQuery = encodeURIComponent(text.trim());
        const apiUrl = `https://api-faa.my.id/faa/ytplay?query=${encodedQuery}`;
        
        const response = await axios.get(apiUrl, { timeout: 30000 });
        const resData = response.data;

        if (!resData || !resData.status || !resData.result) {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply("❌ Could not find any results for that song.");
        }

        const info = resData.result;
        const audioUrl = info.mp3;
        const title = info.title || text;
        const thumbnail = info.thumbnail || '';
        const duration = info.duration_timestamp || '';
        const author = info.author || '';

        if (!audioUrl) {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply("❌ Failed to retrieve the MP3 download link from the API response.");
        }

        let caption = `┏━━━❖ *🎵 Sᴏɴɢ Dᴏᴡɴʟᴏᴀᴅᴇʀ* ❖━━━┓\n\n`;
        caption += `🎶 *Title:* \`${title}\`\n`;
        if (author) caption += `👤 *Artist:* \`${author}\`\n`;
        if (duration) caption += `⏱️ *Duration:* \`${duration}\`\n`;
        caption += `📁 *Status:* \`Sending audio...\`\n\n`;
        caption += `┗━━━━━━━━━━━━━━━━━━━━━━┛\n\n> ⚡ *Version:* \`12.00\`\n> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`;

        if (thumbnail) {
            await conn.sendMessage(from, { 
                image: { url: thumbnail }, 
                caption: caption,
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
        } else {
            await reply(caption);
        }

        await conn.sendMessage(from, {
            audio: { url: audioUrl },
            mimetype: 'audio/mp4',
            ptt: false,
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

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (error) {
        console.error("YTPlay Error:", error);
        reply(`❌ Error: ${error.message}`);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});
