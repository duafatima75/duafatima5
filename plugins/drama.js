import { fileURLToPath } from 'url';
import axios from 'axios';
import yts from 'yt-search';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

const AXIOS_DEFAULTS = { 
    timeout: 60000, 
    headers: { 'User-Agent': 'Mozilla/5.0' } 
};

async function getDownloadLink(url) {
    try {
        const api = `https://jawad-tech.vercel.app/download/ytdl?url=${encodeURIComponent(url)}`;
        const res = await axios.get(api, AXIOS_DEFAULTS);

        if (!res.data || !res.data.status || !res.data.result)
            return null;

        return res.data.result.mp4;
    } catch (err) {
        console.error("API Error:", err.message);
        return null;
    }
}

// 1. VIDEO COMMAND
cmd({
    pattern: "video",
    alias: ["vid", "ytmp4"],
    desc: "Download high quality videos with custom dual options",
    category: "download",
    react: "🎥",
    filename: __filename
}, async (sock, message, m, { q, reply }) => {
    try {
        if (!q) return reply(
            `╔════════════════════════╗\n` +
            `║   🎥 FATIMA-MD VIDEO   🎥   \n` +
            `╚════════════════════════╝\n\n` +
            `❌ *Kripya kisi video ka naam likhein!*\n\n` +
            `> 📌 *Example:* \`.video Naat Sharif\`\n` +
            `> ⚡ *Version:* \`12.00\``
        );

        if (q.includes("youtube.com/") || q.includes("youtu.be/")) 
            return reply("🚫 *Direct links are restricted! Please type the title only.*");

        const search = await yts(q);
        const video = search.videos[0];
        if (!video) return reply("❌ *Koi video nahi mili! Dobara koshish karein.*");

        const branding = "👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*";
        const videoTitle = video.title;

        const videoBox = `
╔════════════════════════╗
║    🎥 FATIMA-MD VIDEO  🎥    
╚════════════════════════╝
 📌 *TITLE:* ${videoTitle}
 ⏱️ *DURATION:* ${video.timestamp}
 👁️ *VIEWS:* ${video.views.toLocaleString()}
 📺 *CHANNEL:* ${video.author.name}
━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 *Reply with a number:*
(1) 📂 \`Document File\`
(2) 🎬 \`Video Stream\`
━━━━━━━━━━━━━━━━━━━━━━━━━━
> ⚡ *Version:* \`12.00\`
${branding}`.trim();

        const sentMsg = await sock.sendMessage(message.chat, {
            image: { url: video.thumbnail },
            caption: videoBox
        }, { quoted: message });

        const listener = async (chatUpdate) => {
            const msg = chatUpdate.messages[0];
            if (!msg.message?.extendedTextMessage) return;

            const selectedText = msg.message.extendedTextMessage.text.trim();
            const context = msg.message.extendedTextMessage.contextInfo;
            const isReplyToBot = context && context.stanzaId === sentMsg.key.id;
            if (!isReplyToBot) return;

            if (!["1","2"].includes(selectedText)) return;

            await sock.sendMessage(message.chat, { 
                react: { text: "⏳", key: msg.key } 
            });

            const dlUrl = await getDownloadLink(video.url);
            if (!dlUrl) {
                await sock.sendMessage(message.chat, { 
                    react: { text: "❌", key: msg.key } 
                });
                return reply("❌ *Video link generate karne mein nakami hui!*");
            }

            const response = await axios.get(dlUrl, { responseType: "arraybuffer" });
            const buffer = Buffer.from(response.data);

            if (selectedText === "1") {
                await sock.sendMessage(message.chat, {
                    document: buffer,
                    mimetype: "video/mp4",
                    fileName: `${videoTitle}.mp4`,
                    caption: `📂 *${videoTitle}*\n\n${branding}`
                }, { quoted: msg });
            } else if (selectedText === "2") {
                await sock.sendMessage(message.chat, {
                    video: buffer,
                    mimetype: "video/mp4",
                    caption: `🎬 *${videoTitle}*\n\n${branding}`
                }, { quoted: msg });
            }

            await sock.sendMessage(message.chat, { 
                react: { text: "✅", key: msg.key } 
            });

            sock.ev.off("messages.upsert", listener);
        };

        sock.ev.on("messages.upsert", listener);
        setTimeout(() => sock.ev.off("messages.upsert", listener), 120000);

    } catch (e) {
        console.error("Video Command Error:", e);
        reply("❌ *Ek takneeki kharabi pesh aayi hai.*");
    }
});

// 2. DRAMA COMMAND
cmd({
    pattern: "drama",
    alias: ["epi"],
    desc: "Download long dramas (≥15 min) with custom dual options",
    category: "download",
    react: "🎬",
    filename: __filename
}, async (sock, message, m, { q, reply }) => {
    try {
        if (!q) return reply(
            `╔════════════════════════╗\n` +
            `║   🎭 FATIMA-MD DRAMA   🎭   \n` +
            `╚════════════════════════╝\n\n` +
            `❌ *Kripya drama ka naam likhein!*\n\n` +
            `> 📌 *Example:* \`.drama Meray Paas Tum Ho Ep 1\`\n` +
            `> ⚡ *Version:* \`12.00\``
        );

        if (q.includes("youtube.com/") || q.includes("youtu.be/")) 
            return reply("🚫 *Direct links are restricted! Please type the title only.*");

        const search = await yts(q);
        const drama = search.videos.find(v => v.seconds >= 900);
        if (!drama) return reply("❌ *Koi suitable drama (≥15 min) nahi mila!*");

        const branding = "👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*";
        const dramaTitle = drama.title;

        const dramaBox = `
╔════════════════════════╗
║    🎭 FATIMA-MD DRAMA  🎭    
╚════════════════════════╝
 📌 *TITLE:* ${dramaTitle}
 ⏱️ *DURATION:* ${drama.timestamp}
 👁️ *VIEWS:* ${drama.views.toLocaleString()}
 📺 *CHANNEL:* ${drama.author.name}
━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 *Reply with a number:*
(1) 📂 \`Document File\`
(2) 🎬 \`Video Stream\`
━━━━━━━━━━━━━━━━━━━━━━━━━━
> ⚡ *Version:* \`12.00\`
${branding}`.trim();

        const sentMsg = await sock.sendMessage(message.chat, {
            image: { url: drama.thumbnail },
            caption: dramaBox
        }, { quoted: message });

        const listener = async (chatUpdate) => {
            const msg = chatUpdate.messages[0];
            if (!msg.message?.extendedTextMessage) return;

            const selectedText = msg.message.extendedTextMessage.text.trim();
            const context = msg.message.extendedTextMessage.contextInfo;
            const isReplyToBot = context && context.stanzaId === sentMsg.key.id;
            if (!isReplyToBot) return;

            if (!["1","2"].includes(selectedText)) return;

            await sock.sendMessage(message.chat, { 
                react: { text: "⏳", key: msg.key } 
            });

            const dlUrl = await getDownloadLink(drama.url);
            if (!dlUrl) {
                await sock.sendMessage(message.chat, { 
                    react: { text: "❌", key: msg.key } 
                });
                return reply("❌ *Drama link generate karne mein nakami hui!*");
            }

            const response = await axios.get(dlUrl, { responseType: "arraybuffer" });
            const buffer = Buffer.from(response.data);

            if (selectedText === "1") {
                await sock.sendMessage(message.chat, {
                    document: buffer,
                    mimetype: "video/mp4",
                    fileName: `${dramaTitle}.mp4`,
                    caption: `📂 *${dramaTitle}*\n\n${branding}`
                }, { quoted: msg });
            } else if (selectedText === "2") {
                await sock.sendMessage(message.chat, {
                    video: buffer,
                    mimetype: "video/mp4",
                    caption: `🎬 *${dramaTitle}*\n\n${branding}`
                }, { quoted: msg });
            }

            await sock.sendMessage(message.chat, { 
                react: { text: "✅", key: msg.key } 
            });

            sock.ev.off("messages.upsert", listener);
        };

        sock.ev.on("messages.upsert", listener);
        setTimeout(() => sock.ev.off("messages.upsert", listener), 120000);

    } catch (e) {
        console.error("Drama Command Error:", e);
        reply("❌ *Ek takneeki kharabi pesh aayi hai.*");
    }
});
