import { fileURLToPath } from 'url';
import axios from 'axios';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

cmd({
  pattern: "fb",
  alias: ["facebook", "fbdl"],
  react: '📥',
  desc: "Download videos from Facebook with FATIMA-MD style",
  category: "download",
  use: ".fb <Facebook video URL>",
  filename: __filename
}, async (conn, mek, m, { from, reply, args, q }) => {
  try {
    const fbUrl = args[0] || q;
    
    if (!fbUrl || !fbUrl.includes("facebook.com")) {
      return reply(
        `╔════════════════════════╗\n` +
        `║   📘 FATIMA-MD FACEBOOK 📘  \n` +
        `╚════════════════════════╝\n\n` +
        `❌ *Kripya valid Facebook video URL dein!*\n\n` +
        `> 📌 *Example:* \`.fb https://www.facebook.com/share/v/...\`\n` +
        `> ⚡ *Version:* \`12.00\``
      );
    }

    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    const apiUrl = `https://jawad-tech.vercel.app/downloader?url=${encodeURIComponent(fbUrl)}`;
    const response = await axios.get(apiUrl, { timeout: 60000 });

    const data = response.data;

    if (!data.status || !data.result || !Array.isArray(data.result)) {
      await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
      return reply("❌ *Video fetch karne mein nakami hui! URL check karein.*");
    }

    const hd = data.result.find(v => v.quality === "HD");
    const sd = data.result.find(v => v.quality === "SD");
    const video = hd || sd;

    if (!video) {
      await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
      return reply("❌ *Response mein koi video nahi mili!*");
    }

    const branding = "👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*";
    const qualityLabel = video.quality || "Standard";

    const captionBox = `
╔════════════════════════╗
║   📘 FATIMA-MD FACEBOOK 📘  
╚════════════════════════╝
 📥 *PLATFORM:* \`Facebook\`
 🛡️ *QUALITY:* \`${qualityLabel}\`
 🚀 *STATUS:* \`Successfully Downloaded\`
━━━━━━━━━━━━━━━━━━━━━━━━━━
> ⚡ *Version:* \`12.00\`
${branding}`.trim();

    await conn.sendMessage(from, {
      video: { url: video.url },
      caption: captionBox
    }, { quoted: mek });

    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

  } catch (error) {
    console.error('FB Download Error:', error);
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    reply("❌ *Takneeki kharabi ki wajah se video download nahi ho saki.*");
  }
});
