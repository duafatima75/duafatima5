// ꜰᴀᴛɪᴍᴀ-ᴍดย

import { fileURLToPath } from 'url';
import axios from 'axios';
import FormData from 'form-data';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

const AgungDevX = {
  config: {
    base: 'https://text2video.aritek.app',
    cipher: 'hbMcgZLlzvghRlLbPcTbCpfcQKM0PcU0zhPcTlOFMxBZ1oLmruzlVp9remPgi0QWP0QW',
    shift: 3,
    ua: 'AgungDevX Coder/1.0.0'
  },

  _decryptToken() {
    const { cipher, shift } = this.config;
    return [...cipher].map(c =>
      /[a-z]/.test(c)
        ? String.fromCharCode((c.charCodeAt(0) - 97 - shift + 26) % 26 + 97)
        : /[A-Z]/.test(c)
        ? String.fromCharCode((c.charCodeAt(0) - 65 - shift + 26) % 26 + 65)
        : c
    ).join('');
  },

  async text2img(prompt) {
    if (!prompt) throw 'Prompt is empty';
    const token = this._decryptToken();
    const form = new FormData();
    form.append('prompt', prompt);
    form.append('token', token);

    const { data } = await axios.post(
      `${this.config.base}/text2img`,
      form,
      {
        headers: {
          'user-agent': this.config.ua,
          authorization: token,
          ...form.getHeaders()
        }
      }
    );

    if (data.code !== 0 || !data.url) throw 'Failed to generate image';
    return data.url.trim();
  }
};

cmd({
    pattern: "txt2img",
    alias: ["t2img", "img"],
    desc: "Generate AI Image from text",
    category: "ai",
    react: "🎨",
    filename: __filename,
}, async (conn, mek, m, { from, text, reply }) => {
    if (!text) return reply(
        `╔════════════════════════╗\n` +
        `║   🎨 FATIMA-MD AI IMG  🎨   \n` +
        `╚════════════════════════╝\n\n` +
        `❌ *Kripya prompt ya text dein!*\n\n` +
        `> 📌 *Example:* \`.txt2img anime girl in forest\`\n` +
        `> ⚡ *Version:* \`12.00\``
    );
    
    try {
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        const img = await AgungDevX.text2img(text);
        
        const captionBox = `
╔════════════════════════╗
║   🎨 AI IMAGE GENERATOR 🎨  
╚════════════════════════╝
 🖌️ *Prompt:* \`${text}\`
 🚀 *Status:* \`Successfully Generated\`
━━━━━━━━━━━━━━━━━━━━━━━━━━
> ⚡ *Version:* \`12.00\`
> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`.trim();

        await conn.sendMessage(from, { 
            image: { url: img }, 
            caption: captionBox
        }, { quoted: mek });
        
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        console.error("Txt2Img Error:", e);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply(`❌ *Error:* ${e}`);
    }
});
