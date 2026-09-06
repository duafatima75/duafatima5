// ꜰᴀᴛɪᴍᴀ-ᴍᴅ

import { fileURLToPath } from 'url';
import axios from 'axios';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

// --- COMMAND 1: igdl ---
cmd({
    pattern: "igdl",
    alias: ["instagram", "insta", "ig"],
    react: "⬇️",
    desc: "Download Instagram videos/reels",
    category: "download",
    use: ".igdl <Instagram URL>",
    filename: __filename
}, async (conn, mek, m, { from, reply, args, q }) => {
    try {
        const url = q || m.quoted?.text;
        if (!url || !url.includes("instagram.com")) {
            return reply(
                `╔════════════════════════╗\n` +
                `║   📸 FATIMA-MD INSTA   📸   \n` +
                `╚════════════════════════╝\n\n` +
                `❌ *Kripya Instagram link dein ya reply karein!*\n\n` +
                `> 📌 *Example:* \`.igdl https://instagram.com/p/...\`\n` +
                `> ⚡ *Version:* \`12.00\``
            );
        }

        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        const apiUrl = `https://api-aswin-sparky.koyeb.app/api/downloader/igdl?url=${encodeURIComponent(url)}`;
        const response = await axios.get(apiUrl, { timeout: 60000 });

        if (!response.data?.status || !response.data.data?.length) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("❌ *Media fetch karne mein nakami hui! Invalid link ya private content.*");
        }

        for (const item of response.data.data) {
            await conn.sendMessage(from, {
                [item.type === 'video' ? 'video' : 'image']: { url: item.url },
                caption: `
╔════════════════════════╗
║   📸 INSTAGRAM MEDIA   📸   
╚════════════════════════╝
 📶 *Platform:* \`Instagram\`
 🛡️ *Quality:* \`HD\`
 🚀 *Status:* \`Successfully Downloaded\`
━━━━━━━━━━━━━━━━━━━━━━━━━━
> ⚡ *Version:* \`12.00\`
> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`.trim()
            }, { quoted: mek });
        }

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error('IGDL Error:', error);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        reply("❌ *Takneeki kharabi ki wajah se download fail ho gaya.*");
    }
});

// --- COMMAND 2: igdl2 ---
cmd({
  pattern: "igdl2",
  alias: ["instagram2", "ig2", "instadl2"],
  react: '📥',
  desc: "Download videos from Instagram (API v5)",
  category: "download",
  use: ".igdl2 <Instagram video URL>",
  filename: __filename
}, async (conn, mek, m, { from, reply, args, q }) => {
  try {
    const igUrl = args[0] || q;
    if (!igUrl || !igUrl.includes("instagram.com")) {
      return reply(
        `╔════════════════════════╗\n` +
        `║   📥 FATIMA-MD IG-v2   📥   \n` +
        `╚════════════════════════╝\n\n` +
        `❌ *Kripya valid Instagram URL dein!*\n\n` +
        `> 📌 *Example:* \`.igdl2 https://instagram.com/reel/...\`\n` +
        `> ⚡ *Version:* \`12.00\``
      );
    }

    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    const apiUrl = `https://jawad-tech.vercel.app/downloader?url=${encodeURIComponent(igUrl)}`;
    const response = await axios.get(apiUrl, { timeout: 60000 });

    const data = response.data;

    if (!data.status || !data.result || !Array.isArray(data.result)) {
      await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
      return reply("❌ *Video fetch karne mein nakami hui! URL check karein.*");
    }

    const videoUrl = data.result[0];
    if (!videoUrl) {
      await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
      return reply("❌ *Response mein koi video nahi mili!*");
    }

    const metadata = data.metadata || {};
    const author = metadata.author || "Unknown";
    const captionText = metadata.caption ? metadata.caption.slice(0, 200) + "..." : "No caption provided.";
    const likes = metadata.like || 0;
    const comments = metadata.comment || 0;

    await conn.sendMessage(from, {
      video: { url: videoUrl },
      caption: `
╔════════════════════════╗
║   📥 INSTAGRAM REEL    📥   
╚════════════════════════╝
 👤 *Author:* \`${author}\`
 ❤️ *Likes:* \`${likes}\` | 💭 *Comments:* \`${comments}\`
 💬 *Caption:* ${captionText}
━━━━━━━━━━━━━━━━━━━━━━━━━━
> ⚡ *Version:* \`12.00\`
> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`.trim()
    }, { quoted: mek });

    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
  } catch (error) {
    console.error('IGDL2 Error:', error);
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    reply("❌ *Takneeki kharabi ki wajah se video download nahi ho saki.*");
  }
});

// --- COMMAND 3: igdl3 ---
cmd({
    pattern: "igdl3",
    alias: ["instagram3", "insta3", "ig3"],
    react: "⬇️",
    desc: "Download Instagram posts, reels, and stories",
    category: "download",
    use: ".igdl3 <Instagram URL>",
    filename: __filename
}, async (conn, mek, m, { from, reply, args, q }) => {
    try {
        const url = q || m.quoted?.text;
        if (!url || !url.includes("instagram.com")) {
            return reply(
                `╔════════════════════════╗\n` +
                `║   📱 FATIMA-MD IG-v3   📱   \n` +
                `╚════════════════════════╝\n\n` +
                `❌ *Kripya valid Instagram link dein ya reply karein!*\n\n` +
                `> 📌 *Example:* \`.igdl3 https://instagram.com/p/...\`\n` +
                `> ⚡ *Version:* \`12.00\``
            );
        }

        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });  

        const apiUrl = `https://jawad-tech.vercel.app/igdl?url=${encodeURIComponent(url)}`;
        const response = await axios.get(apiUrl, { timeout: 60000 });

        if (!response.data?.status || !response.data.result?.length) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("❌ *Media fetch karne mein nakami hui! Link ya content check karein.*");
        }

        const mediaData = response.data.result;

        for (const item of mediaData) {
            const isVideo = item.contentType?.includes('video') || item.format === 'mp4';
            const fileSize = item.size ? (item.size / 1024 / 1024).toFixed(2) : "0.00";
            
            if (isVideo) {
                await conn.sendMessage(from, {
                    video: { url: item.url },
                    caption: `
╔════════════════════════╗
║   📱 INSTAGRAM VIDEO   📱   
╚════════════════════════╝
 📹 *Type:* \`Video\`
 💾 *Size:* \`${fileSize} MB\`
 🎞️ *Format:* \`${item.format || 'mp4'}\`
━━━━━━━━━━━━━━━━━━━━━━━━━━
> ⚡ *Version:* \`12.00\`
> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`.trim()
                }, { quoted: mek });
            } else {
                const imgSize = item.size ? (item.size / 1024).toFixed(2) : "0.00";
                await conn.sendMessage(from, {
                    image: { url: item.url },
                    caption: `
╔════════════════════════╗
║   🖼️ INSTAGRAM IMAGE   🖼️   
╚════════════════════════╝
 🖼️ *Type:* \`Image\`
 💾 *Size:* \`${imgSize} KB\`
 🎨 *Format:* \`${item.format || 'jpg'}\`
━━━━━━━━━━━━━━━━━━━━━━━━━━
> ⚡ *Version:* \`12.00\`
> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`.trim()
                }, { quoted: mek });
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error('IGDL3 Error:', error);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        reply("❌ *Download fail ho gaya. Dubara koshish karein.*");
    }
});
