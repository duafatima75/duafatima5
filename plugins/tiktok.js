// ꜰᴀᴛɪᴍᴀ-ᴍᴅ - HTML TIKTOK DOWNLOADER

import { fileURLToPath } from 'url';
import path from 'path';
import crypto from 'crypto';
import os from 'os';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

const SIG = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LVZlcmlmaWNhdGlvblNpZ25hdHVyZS5NZXRhZGF0YeN55YRyad2+ZA==";
const CERT1 = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGEOvtJr968bbpKdZreOTwkk9aPN++XPE60RfuzNLkXXc7LE8BOkJOWRpo2oNXaRJ3uCNJ43HY3A+oetnvHSfcxWqmvvTSrBOI5V1NOD6RMsZ/st1XVPUx83AGps1l5jYBOYzqMNy6un2tToJ2Bt9bXRo29tWLZTu8m7TNY/hISwVpVc5tjSet5U7btPN+dMIx2UvykB1jcbWGsdklheeuz8RXSStNXzeaGvsf1lpZ/ugLE4b2BdmlRNKrY6zLE4qFtRYQoS7axOyQX+4QUyN2m9bfm7urQmn+QRSXJwMO7X5kAJJLbkVGJFt9Pm9VXPwQVrK2aaqiXlpusj+7DfDw00OULmYMmZDTqXM0nUVLxj13z0LhMQoQhhNG8utdUn4uKOFceliTZ/xiP+A54GnX9620641bqw3ctfh9NNXPsTEK8hAUD7FDqUhVntHmoEYYEHq8X1tHHZYP49/f2iezTiE8AUaoZo42/jIWQIKohOGNUib2hEqMkW8NsR8vPihvNuqPc0zKZcl6359YFQdjiiW8kCRD/rsDOr9v1eYLFZKYloFyzFqEgj+jcG/V47elOjShJ5CCPwatXwP6HIloVwtgygFsnOFmCg6Ojoivfoz8Nw1qxFwg5OU2cq/1WbWNELKnaFg4eUWCAIJ/3ZIJsEPkgemZxGhE+hdiNn9dkQYBJs1kx2BxdIkJmQ9vJSKkrMz6lTxZM3IJ9mhmKS6zYdU1ppeAao0/ayte997DQParb/AHLN79g0iW1ad0z8ir5jAl0q3a+UZPTSa4YiSqC2PZ/gfxG5wvL2mKmeKowG0RXjmEp5iNxrni+T/HRLZOoH7y0DQ24nMCPg";
const CERT2 = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGHsL0Ccm0ELINFZ2IaBhKaeWnVuh0o6nZLCioCn9xpSADzwIS5VCWO+1eVXT2atJOyf7FYlpB0/JA3Us+aQtekuIkHu/zBXijORZ4ClF4+sF3cSTNg6gY/+6iwLK/zs3bMg+GeJrcI65vXfs95Shxlb2Rd5GRT2/2yBmR6Zkf5QwMJuptUHWtM26WY7/xlkEKGFZVqOSylusiOzSALa815zC6dCiHoJNLBEKMlaZZQOk57/+OYoU5zzTaEgLhyvNFHSyAlyLQ3SGFtVHAaJZHSmmSPyJowCOB+92Gkk6SWVMsk6FbU8QJWFtlhzV/W/gZ7WzUlS/AKgN0th9/cq20ToFkW7X9c+rtYavufmuieqFhXgaMD8AGsoN9QC/HzNC9D1nydPfFYEUr9BHVy2nF5gM58Y59r2rT8p5LPARIkUp8g+5DLhyW0tdZFZ1305o4AHCayZnp5rjcU2Xi/c1Qf/djBGakmijlMs4aMzKJYD0c4Q8jdI7sNyd876K2wRD+L6KeD2QB3PtCS4P7BWAl5gh5CJ6ZBrwcaKXZqcSjEwm52MqVCgYZdapAaNYUy/QndttjLOG0wxxwuX1hIhMjPnIKZR1kwnqD5EqlHpilrnojRZvjVGN4zEKmilS8rNstt4HHs/D849W+Q6LRVWiWMs0cT2IugrX+Skxd8En7Gq52UEmuVBrSTpN+UpIu20NsVb9lsvuYh3XO441606tOEY2eKcZJdTtqrOTNqbbTk0zVn1yhbOCvmfctBNDhTwaC5QMi0P9wjU5XI9SBtkdQLizc5oqpoiHeqgb8+aJHVLcbgIJ/KLZKtRWFDfzRNM02Csx4etUUapVd2NA/L0oMs/O5T9sVj9FBJ7q99GWr3PVmxJb36mHZLXC4k1gGN9swE0LtzYsUdT5tUo9ri/hS3W/SM+F1p4Kh4QIgRcG3ciIHGN44bnDh3HDCz0fDnzKYw0bclMxZPctEyJ5gEOPF6OAkjD9dEaRGq/tEPf1k9Aub+v2dEjnfrYWAm4E5Zfhs2Xh0CT0k+SzhgKd0K/46ChJ20G5+blwpIvahvTVS68+aVIX6CwXs4tcVx6FnmVsMOOkIasfaqQLZYbNBkuLoZnQAq4j8yRekrQ==";

async function tiktokScraper(url) {
    try {
        const r = await axios.post(
            'https://savetik.co/api/ajaxSearch',
            new URLSearchParams({ q: url, lang: 'id' }).toString(),
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10)',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest',
                    origin: 'https://savetik.co',
                    referer: 'https://savetik.co/id1'
                }
            }
        );
        const $ = cheerio.load(r.data.data);
        return {
            title: $('h3').first().text().trim() || 'TikTok Media',
            thumbnail: $('.image-tik img').attr('src') || $('.thumbnail img').attr('src') || 'https://i.ibb.co/3r13z6h/images.jpg',
            mp4: $('.dl-action a:contains("MP4")').not(':contains("HD")').attr('href') || null,
            mp4_hd: $('.dl-action a:contains("HD")').attr('href') || null,
            mp3: $('.dl-action a:contains("MP3")').attr('href') || null,
            foto: $('.photo-list a[href*="snapcdn"]').map((_, e) => $(e).attr('href')).get()
        };
    } catch (e) {
        return { status: 'error', msg: e.message };
    }
}

cmd({
    pattern: "tiktok",
    alias: ["tt", "ttdl"],
    react: "📥",
    desc: "Download TikTok videos or photos with HTML card design",
    category: "downloader",
    filename: __filename
},           
async (conn, mek, m, { from, q, reply, prefix, sender }) => {
    try {
        if (!q) return reply(
            `┏━━━❖ *🎵 TIKTOK MATRIX* ❖━━━┓\n` +
            `┃\n` +
            `┃ ⚠️ *Please provide a TikTok link!*\n` +
            `┃ 📌 *Example:* \`${prefix}tiktok https://vt.tiktok.com/...\`\n` +
            `┃\n` +
            `┗━━━━━━━━━━━━━━━━━━━━━━┛\n\n` +
            `> ⚡ *Version:* \`12.00\``
        );

        const targetChat = conn.decodeJid(from);
        await conn.sendMessage(targetChat, { react: { text: "🔍", key: m.key } });

        const data = await tiktokScraper(q.trim());

        if (data.status === 'error' || (!data.mp4 && !data.mp4_hd && (!data.foto || data.foto.length === 0))) {
            await conn.sendMessage(targetChat, { react: { text: "❌", key: m.key } });
            return reply("❌ *TikTok media fetch karne mein nakami hui! Link invalid ya private hai.*");
        }

        const mediaTitle = data.title.length > 45 ? data.title.substring(0, 42) + '...' : data.title;
        const thumbnail = data.thumbnail;
        const videoUrl = data.mp4_hd || data.mp4;

        const htmlPayload = `<style>
* { -webkit-tap-highlight-color: transparent; -webkit-user-select: none; user-select: none; box-sizing: border-box; }
body { margin: 0; background: transparent; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #eee; }
.tt-wrap { width: 100%; max-width: 520px; margin: auto; padding: 12px; }
.tt-card { background: rgba(15, 18, 28, 0.94); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); border: 1px solid rgba(255, 0, 127, 0.35); border-radius: 18px; overflow: hidden; box-shadow: 0 8px 32px rgba(255, 0, 127, 0.2), 0 0 20px rgba(0, 243, 255, 0.25); }
.tt-header { padding: 14px 18px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); display: flex; justify-content: space-between; align-items: center; background: linear-gradient(90deg, rgba(255,0,127,0.1), rgba(0,243,255,0.1)); }
.tt-sub { font-size: 10px; letter-spacing: 2px; color: #ff007f; font-weight: 700; text-transform: uppercase; }
.tt-title-top { font-size: 20px; font-weight: 900; color: #fff; text-shadow: 0 0 10px rgba(255, 0, 127, 0.6); letter-spacing: 1px; }
.tt-body { padding: 16px; display: flex; gap: 14px; align-items: center; }
.tt-thumb { width: 110px; height: 110px; border-radius: 12px; object-fit: cover; border: 2px solid rgba(255, 0, 127, 0.4); box-shadow: 0 0 12px rgba(255,0,127,0.3); flex-shrink: 0; }
.tt-info { flex: 1; overflow: hidden; }
.song-title { font-size: 14px; font-weight: 800; color: #fff; margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-shadow: 0 0 6px rgba(255,255,255,0.3); }
.song-detail { font-size: 12px; color: rgba(255, 255, 255, 0.7); margin-bottom: 5px; font-weight: 600; display: flex; align-items: center; gap: 6px; }
.tt-footer { border-top: 1px solid rgba(255, 255, 255, 0.1); padding: 12px 18px; background: rgba(0,0,0,0.3); display: flex; justify-content: space-between; align-items: center; font-size: 11px; }
.status-badge { background: rgba(0, 255, 135, 0.15); border: 1px solid rgba(0, 255, 135, 0.4); color: #00ff87; padding: 4px 10px; border-radius: 20px; font-weight: 800; font-size: 10px; letter-spacing: 0.5px; }
</style>

<div class="tt-wrap">
  <div class="tt-card">
    <div class="tt-header">
      <div>
        <div class="tt-sub">FATIMA-MD MEDIA DOWNLOADER</div>
        <div class="tt-title-top">TikTok Loader 📥</div>
      </div>
      <div>
        <span class="status-badge">SUCCESS</span>
      </div>
    </div>
    <div class="tt-body">
      <img src="${thumbnail}" class="tt-thumb" alt="Thumbnail">
      <div class="tt-info">
        <div class="song-title" title="${data.title}">${mediaTitle}</div>
        <div class="song-detail">📌 <b>Platform:</b> TikTok</div>
        <div class="song-detail">🚀 <b>Status:</b> Media Ready</div>
        <div class="song-detail">📁 <b>Type:</b> ${videoUrl ? 'Video MP4' : 'Photo Slideshow'}</div>
      </div>
    </div>
    <div class="tt-footer">
      <span style="color: rgba(255,255,255,0.6); font-weight: 600;">⚡ Version: <b>12.00</b></span>
      <span style="color: #ff007f; font-weight: 700;">👑 Powered by FATIMA-MD</span>
    </div>
  </div>
</div>`;

        const responseId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
        const responseData = {
            response_id: responseId,
            sections: [{
                view_model: {
                    primitive: {
                        __typename: "GenAIaeacdsnwHtmlPrimitive",
                        payload: htmlPayload,
                        trusted_sources: ["fatimamv.dev"]
                    },
                    __typename: "GenAISingleLayoutViewModel"
                }
            }]
        };

        const jsonString = JSON.stringify(responseData);
        const dataBase64 = Buffer.from(jsonString).toString('base64');

        await conn.relayMessage(targetChat, {
            messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2,
                botMetadata: {
                    messageDisclaimerText: "",
                    botResponseId: responseId,
                    verificationMetadata: {
                        proofs: [{
                            version: 1,
                            useCase: 1,
                            signature: SIG,
                            certificateChain: [CERT1, CERT2]
                        }]
                    }
                }
            },
            botForwardedMessage: {
                message: {
                    richResponseMessage: {
                        messageType: 1,
                        submessages: [{ messageType: 2, messageText: "FATIMA-MD TikTok Downloader" }],
                        unifiedResponse: { data: dataBase64 },
                        contextInfo: {
                            forwardingScore: 999,
                            isForwarded: true,
                            forwardedAiBotMessageInfo: { botJid: "867051314767696@bot" },
                            forwardOrigin: 4,
                            mentionedJid: [sender],
                            forwardedNewsletterMessageInfo: { 
                                newsletterJid: '120363412031212190@newsletter', 
                                newsletterName: 'ꜰᴀᴛɪᴍᴀ-ᴍᴅ ᴏғғɪᴄɪᴀʟ', 
                                serverMessageId: 143 
                            }
                        }
                    }
                }
            }
        }, { messageId: responseId, quoted: mek });

        if (videoUrl) {
            await conn.sendMessage(targetChat, {
                video: { url: videoUrl },
                mimetype: "video/mp4",
                contextInfo: { 
                    mentionedJid: [sender],
                    forwardingScore: 999, 
                    isForwarded: true, 
                    forwardedNewsletterMessageInfo: { 
                        newsletterJid: '120363412031212190@newsletter', 
                        newsletterName: 'ꜰᴀᴛɪᴍᴀ-ᴍᴅ ᴏғғɪᴄɪᴀʟ', 
                        serverMessageId: 143 
                    } 
                }
            }, { quoted: mek });
        } else if (data.foto && data.foto.length > 0) {
            for (let img of data.foto) {
                await conn.sendMessage(targetChat, { 
                    image: { url: img },
                    contextInfo: { 
                        mentionedJid: [sender],
                        forwardingScore: 999, 
                        isForwarded: true, 
                        forwardedNewsletterMessageInfo: { 
                            newsletterJid: '120363412031212190@newsletter', 
                            newsletterName: 'ꜰᴀᴛɪᴍᴀ-ᴍᴅ ᴏғғɪᴄɪᴀʟ', 
                            serverMessageId: 143 
                        } 
                    }
                }, { quoted: mek });
            }
        }

        await conn.sendMessage(targetChat, { react: { text: "✅", key: m.key } });

    } catch (e) {
        console.error("TikTok HTML Error:", e);
        await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
        reply("❌ *An unexpected error occurred while downloading TikTok media.*");
    }
});
