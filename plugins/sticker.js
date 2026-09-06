// ꜰᴀᴛɪᴍᴀ-ᴍᴅ

import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { Sticker, StickerTypes } from 'wa-sticker-formatter';
import { cmd } from '../command.js';
import StickerMaker from '../lib/converter.js';

const __filename = fileURLToPath(import.meta.url);

cmd(
    {
        pattern: 'sticker',
        alias: ['s', 'take', 'rename', 'stake', 'vsticker', 'gsticker', 'g2s', 'gs', 'v2s', 'vs'],
        desc: 'Create stickers from images, videos, GIFs with custom pack names',
        category: 'tools',
        react: "⚡",
        use: '<reply media> | <pack name>',
        filename: __filename,
    },
    async (conn, mek, m, { quoted, args, q, reply, from, userConfig }) => {
        if (!mek.quoted) return reply(
            `╔════════════════════════╗\n` +
            `║   🎨 FATIMA-MD STICKER 🎨   \n` +
            `╚════════════════════════╝\n\n` +
            `❌ *Kripya kisi Image, Video, GIF ya Sticker par reply karein!*\n\n` +
            `> ⚡ *Version:* \`12.00\``
        );
        
        let mime = mek.quoted.mtype;
        const defaultPackName = userConfig?.STICKER_NAME || global.config?.STICKER_NAME || "ꜰᴀᴛɪᴍᴀ-ᴍᴅ";
        let pack = q ? q : defaultPackName;
        
        try {
            await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

            let media, stickerBuffer;
            
            if (mime === "imageMessage" || mime === "stickerMessage") {
                media = await mek.quoted.download();
                
                let sticker = new Sticker(media, {
                    pack: pack, 
                    type: StickerTypes.FULL,
                    categories: ["🤩", "🎉"],
                    id: crypto.randomBytes(4).toString('hex'),
                    quality: 75,
                    background: 'transparent',
                });
                stickerBuffer = await sticker.toBuffer();
                
            } else if (mime === "videoMessage") {
                media = await mek.quoted.download();
                const webpBuffer = await StickerMaker.videoToWebp(media);
                
                let sticker = new Sticker(webpBuffer, {
                    pack: pack,
                    type: StickerTypes.FULL,
                    categories: ["🤩", "🎉"],
                    id: crypto.randomBytes(4).toString('hex'),
                    quality: 75,
                    background: 'transparent',
                });
                stickerBuffer = await sticker.toBuffer();
                
            } else {
                await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
                return reply("❌ *Unsupported media type! Reply to an image, video, or sticker.*");
            }
            
            await conn.sendMessage(mek.chat, { 
                sticker: stickerBuffer,
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

            await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
            
        } catch (error) {
            console.error("Sticker creation error:", error);
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply(`❌ *Error creating sticker: ${error.message}*`);
        }
    }
);

cmd({
    pattern: "attp",
    desc: "Convert text to a GIF sticker with FATIMA-MD style",
    react: "✨",
    category: "tools", 
    use: ".attp HI",
    filename: __filename,
}, async (conn, mek, m, { args, reply, from }) => {
    try {
        if (!args[0]) return reply(
            `╔════════════════════════╗\n` +
            `║   ✨ FATIMA-MD ATTP    ✨   \n` +
            `╚════════════════════════╝\n\n` +
            `❌ *Kripya kuch text dein!*\n\n` +
            `> 📌 *Example:* \`.attp FATIMA\`\n` +
            `> ⚡ *Version:* \`12.00\``
        );

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        const gifBuffer = await StickerMaker.fetchGif(`https://api-fix.onrender.com/api/maker/attp?text=${encodeURIComponent(args.join(" "))}`);
        const stickerBuffer = await StickerMaker.gifToSticker(gifBuffer);

        await conn.sendMessage(m.chat, { 
            sticker: stickerBuffer,
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

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (error) {
        console.error("ATTP error:", error);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply(`❌ *ATTP Error:* ${error.message}`);
    }
});
