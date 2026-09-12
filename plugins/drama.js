// ꜰᴀᴛɪᴍᴀ-ᴍᴅ - HTML VIDEO / DRAMA DOWNLOADER (CLEAN SUCCESS CARD)

import { fileURLToPath } from 'url';
import path from 'path';
import crypto from 'crypto';
import os from 'os';
import axios from 'axios';
import yts from 'yt-search';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

const SIG = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LVZlcmlmaWNhdGlvblNpZ25hdHVyZS5NZXRhZGF0YeN55YRyad2+ZA==";
const CERT1 = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGEOvtJr968bbpKdZreOTwkk9aPN++XPE60RfuzNLkXXc7LE8BOkJOWRpo2oNXaRJ3uCNJ43HY3A+oetnvHSfcxWqmvvTSrBOI5V1NOD6RMsZ/st1XVPUx83AGps1l5jYBOYzqMNy6un2tToJ2Bt9bXRo29tWLZTu8m7TNY/hISwVpVc5tjSet5U7btPN+dMIx2UvykB1jcbWGsdklheeuz8RXSStNXzeaGvsf1lpZ/ugLE4b2BdmlRNKrY6zLE4qFtRYQoS7axOyQX+4QUyN2m9bfm7urQmn+QRSXJwMO7X5kAJJLbkVGJFt9Pm9VXPwQVrK2aaqiXlpusj+7DfDw00OULmYMmZDTqXM0nUVLxj13z0LhMQoQhhNG8utdUn4uKOFceliTZ/xiP+A54GnX9620641bqw3ctfh9NNXPsTEK8hAUD7FDqUhVntHmoEYYEHq8X1tHHZYP49/f2iezTiE8AUaoZo42/jIWQIKohOGNUib2hEqMkW8NsR8vPihvNuqPc0zKZcl6359YFQdjiiW8kCRD/rsDOr9v1eYLFZKYloFyzFqEgj+jcG/V47elOjShJ5CCPwatXwP6HIloVwtgygFsnOFmCg6Ojoivfoz8Nw1qxFwg5OU2cq/1WbWNELKnaFg4eUWCAIJ/3ZIJsEPkgemZxGhE+hdiNn9dkQYBJs1kx2BxdIkJmQ9vJSKkrMz6lTxZM3IJ9mhmKS6zYdU1ppeAao0/ayte997DQParb/AHLN79g0iW1ad0z8ir5jAl0q3a+UZPTSa4YiSqC2PZ/gfxG5wvL2mKmeKowG0RXjmEp5iNxrni+T/HRLZOoH7y0DQ24nMCPg";
const CERT2 = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGHsL0Ccm0ELINFZ2IaBhKaeWnVuh0o6nZLCioCn9xpSADzwIS5VCWO+1eVXT2atJOyf7FYlpB0/JA3Us+aQtekuIkHu/zBXijORZ4ClF4+sF3cSTNg6gY/+6iwLK/zs3bMg+GeJrcI65vXfs95Shxlb2Rd5GRT2/2yBmR6Zkf5QwMJuptUHWtM26WY7/xlkEKGFZVqOSylusiOzSALa815zC6dCiHoJNLBEKMlaZZQOk57/+OYoU5zzTaEgLhyvNFHSyAlyLQ3SGFtVHAaJZHSmmSPyJowCOB+92Gkk6SWVMsk6FbU8QJWFtlhzV/W/gZ7WzUlS/AKgN0th9/cq20ToFkW7X9c+rtYavufmuieqFhXgaMD8AGsoN9QC/HzNC9D1nydPfFYEUr9BHVy2nF5gM58Y59r2rT8p5LPARIkUp8g+5DLhyW0tdZFZ1305o4AHCayZnp5rjcU2Xi/c1Qf/djBGakmijlMs4aMzKJYD0c4Q8jdI7sNyd876K2wRD+L6KeD2QB3PtCS4P7BWAl5gh5CJ6ZBrwcaKXZqcSjEwm52MqVCgYZdapAaNYUy/QndttjLOG0wxxwuX1hIhMjPnIKZR1kwnqD5EqlHpilrnojRZvjVGN4zEKmilS8rNstt4HHs/D849W+Q6LRVWiWMs0cT2IugrX+Skxd8En7Gq52UEmuVBrSTpN+UpIu20NsVb9lsvuYh3XO441606tOEY2eKcZJdTtqrOTNqbbTk0zVn1yhbOCvmfctBNDhTwaC5QMi0P9wjU5XI9SBtkdQLizc5oqpoiHeqgb8+aJHVLcbgIJ/KLZKtRWFDfzRNM02Csx4etUUapVd2NA/L0oMs/O5T9sVj9FBJ7q99GWr3PVmxJb36mHZLXC4k1gGN9swE0LtzYsUdT5tUo9ri/hS3W/SM+F1p4Kh4QIgRcG3ciIHGN44bnDh3HDCz0fDnzKYw0bclMxZPctEyJ5gEOPF6OAkjD9dEaRGq/tEPf1k9Aub+v2dEjnfrYWAm4E5Zfhs2Xh0CT0k+SzhgKd0K/46ChJ20G5+blwpIvahvTVS68+aVIX6CwXs4tcVx6FnmVsMOOkIasfaqQLZYbNBkuLoZnQAq4j8yRekrQ==";

const AXIOS_DEFAULTS = { 
    timeout: 60000, 
    headers: { 'User-Agent': 'Mozilla/5.0' } 
};

async function getDownloadLink(url) {
    try {
        const api = `https://jawad-tech.vercel.app/download/ytdl?url=${encodeURIComponent(url)}`;
        const res = await axios.get(api, AXIOS_DEFAULTS);
        if (!res.data || !res.data.status || !res.data.result) return null;
        return res.data.result.mp4;
    } catch (err) {
        console.error("API Error:", err.message);
        return null;
    }
}

async function handleVideoProcess(sock, message, m, { q, reply }, isDrama = false) {
    try {
        if (!q) return reply(
            `┏━━━❖ *🎥 FATIMA-MD MATRIX* ❖━━━┓\n` +
            `┃\n` +
            `┃ ⚠️ *Kripya naam likhein!*\n` +
            `┃ 📌 *Example:* \`.${isDrama ? 'drama' : 'video'} Naat Sharif\`\n` +
            `┃\n` +
            `┗━━━━━━━━━━━━━━━━━━━━━━┛\n\n` +
            `> ⚡ *Version:* \`12.00\``
        );

        if (q.includes("youtube.com/") || q.includes("youtu.be/")) 
            return reply("🚫 *Direct links are restricted! Please type the title only.*");

        const search = await yts(q);
        const video = isDrama ? search.videos.find(v => v.seconds >= 900) : search.videos[0];
        
        if (!video) return reply(isDrama ? "❌ *Koi suitable drama (≥15 min) nahi mila!*" : "❌ *Koi video nahi mili! Dobara koshish karein.*");

        const videoTitle = video.title;
        const thumbnail = video.thumbnail || 'https://i.ibb.co/3r13z6h/images.jpg';
        const displayTitle = videoTitle.length > 35 ? videoTitle.substring(0, 32) + '...' : videoTitle;

        const htmlPayload = `<style>
* { -webkit-tap-highlight-color: transparent; -webkit-user-select: none; user-select: none; box-sizing: border-box; }
body { margin: 0; background: transparent; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #eee; }
.vid-wrap { width: 100%; max-width: 520px; margin: auto; padding: 12px; }
.vid-card { background: rgba(15, 18, 28, 0.94); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); border: 1px solid rgba(0, 243, 255, 0.35); border-radius: 18px; overflow: hidden; box-shadow: 0 8px 32px rgba(0, 243, 255, 0.2), 0 0 20px rgba(255, 0, 127, 0.25); }
.vid-header { padding: 14px 18px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); display: flex; justify-content: space-between; align-items: center; background: linear-gradient(90deg, rgba(0,243,255,0.1), rgba(255,0,127,0.1)); }
.vid-sub { font-size: 10px; letter-spacing: 2px; color: #00f3ff; font-weight: 700; text-transform: uppercase; }
.vid-title-top { font-size: 19px; font-weight: 900; color: #fff; text-shadow: 0 0 10px rgba(0, 243, 255, 0.6); letter-spacing: 1px; }
.vid-body { padding: 16px; display: flex; gap: 14px; align-items: center; }
.vid-thumb { width: 110px; height: 110px; border-radius: 12px; object-fit: cover; border: 2px solid rgba(0, 243, 255, 0.4); box-shadow: 0 0 12px rgba(0,243,255,0.3); flex-shrink: 0; }
.vid-info { flex: 1; overflow: hidden; }
.song-title { font-size: 14px; font-weight: 800; color: #fff; margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-shadow: 0 0 6px rgba(255,255,255,0.3); }
.song-detail { font-size: 11px; color: rgba(255, 255, 255, 0.7); margin-bottom: 4px; font-weight: 600; display: flex; align-items: center; gap: 6px; }
.vid-footer { border-top: 1px solid rgba(255, 255, 255, 0.1); padding: 12px 18px; background: rgba(0,0,0,0.3); }
.prompt-box { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 10px; text-align: center; font-size: 12px; font-weight: 800; color: #00ff87; margin-bottom: 10px; text-shadow: 0 0 8px rgba(0,255,135,0.4); }
.option-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
.option-btn { background: rgba(0, 243, 255, 0.12); border: 1px solid rgba(0, 243, 255, 0.35); border-radius: 8px; padding: 8px; text-align: center; color: #fff; font-size: 11px; font-weight: 800; text-transform: uppercase; }
</style>

<div class="vid-wrap">
  <div class="vid-card">
    <div class="vid-header">
      <div>
        <div class="vid-sub">FATIMA-MD MEDIA DOWNLOADER</div>
        <div class="vid-title-top">${isDrama ? 'Drama Stream 🎬' : 'Video Stream 🎥'}</div>
      </div>
      <div>
        <span style="background: rgba(0,255,135,0.15); border: 1px solid rgba(0,255,135,0.4); color: #00ff87; padding: 4px 10px; border-radius: 20px; font-weight: 800; font-size: 10px;">SELECT</span>
      </div>
    </div>
    <div class="vid-body">
      <img src="${thumbnail}" class="vid-thumb" alt="Thumbnail">
      <div class="vid-info">
        <div class="song-title" title="${videoTitle}">${displayTitle}</div>
        <div class="song-detail">⏱️ <b>Duration:</b> ${video.timestamp}</div>
        <div class="song-detail">👁️ <b>Views:</b> ${video.views.toLocaleString()}</div>
        <div class="song-detail">📺 <b>Channel:</b> ${video.author.name}</div>
      </div>
    </div>
    <div class="vid-footer">
      <div class="prompt-box">💬 REPLY WITH (1) DOCUMENT OR (2) VIDEO</div>
      <div class="option-grid">
        <div class="option-btn">(1) 📂 Document</div>
        <div class="option-btn">(2) 🎬 Stream</div>
      </div>
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

        await sock.relayMessage(message.chat, {
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
                        submessages: [{ messageType: 2, messageText: "FATIMA-MD Video Downloader" }],
                        unifiedResponse: { data: dataBase64 },
                        contextInfo: {
                            forwardingScore: 999,
                            isForwarded: true,
                            forwardedAiBotMessageInfo: { botJid: "867051314767696@bot" },
                            forwardOrigin: 4,
                            mentionedJid: [message.sender],
                            forwardedNewsletterMessageInfo: { 
                                newsletterJid: '120363412031212190@newsletter', 
                                newsletterName: 'ꜰᴀᴛɪᴍᴀ-ᴍᴅ ᴏғғɪᴄɪᴀʟ', 
                                serverMessageId: 428 
                            }
                        }
                    }
                }
            }
        }, { messageId: responseId, quoted: message });

        const listener = async (chatUpdate) => {
            const msg = chatUpdate.messages[0];
            if (!msg.message?.extendedTextMessage) return;

            const selectedText = msg.message.extendedTextMessage.text.trim();
            const context = msg.message.extendedTextMessage.contextInfo;
            const isReplyToBot = context && context.stanzaId === responseId;
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
                    fileName: `${videoTitle}.mp4`
                }, { quoted: msg });
            } else if (selectedText === "2") {
                await sock.sendMessage(message.chat, {
                    video: buffer,
                    mimetype: "video/mp4"
                }, { quoted: msg });
            }

            // HTML Success Response Card with proper thumbnail
            const successHtml = `<style>
* { -webkit-tap-highlight-color: transparent; -webkit-user-select: none; user-select: none; box-sizing: border-box; }
body { margin: 0; background: transparent; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #eee; }
.succ-wrap { width: 100%; max-width: 520px; margin: auto; padding: 12px; }
.succ-card { background: rgba(15, 18, 28, 0.94); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); border: 1px solid rgba(0, 255, 135, 0.35); border-radius: 18px; overflow: hidden; box-shadow: 0 8px 32px rgba(0, 255, 135, 0.2), 0 0 20px rgba(0, 243, 255, 0.25); }
.succ-header { padding: 14px 18px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); display: flex; justify-content: space-between; align-items: center; background: linear-gradient(90deg, rgba(0,255,135,0.1), rgba(0,243,255,0.1)); }
.succ-sub { font-size: 10px; letter-spacing: 2px; color: #00ff87; font-weight: 700; text-transform: uppercase; }
.succ-title-top { font-size: 19px; font-weight: 900; color: #fff; text-shadow: 0 0 10px rgba(0, 255, 135, 0.6); letter-spacing: 1px; }
.succ-body { padding: 16px; display: flex; gap: 14px; align-items: center; }
.succ-thumb { width: 110px; height: 110px; border-radius: 12px; object-fit: cover; border: 2px solid rgba(0, 255, 135, 0.4); box-shadow: 0 0 12px rgba(0,255,135,0.3); flex-shrink: 0; }
.succ-info { flex: 1; overflow: hidden; }
.song-title { font-size: 14px; font-weight: 800; color: #fff; margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-shadow: 0 0 6px rgba(255,255,255,0.3); }
.song-detail { font-size: 11px; color: rgba(255, 255, 255, 0.7); margin-bottom: 4px; font-weight: 600; display: flex; align-items: center; gap: 6px; }
.succ-footer { border-top: 1px solid rgba(255, 255, 255, 0.1); padding: 12px 18px; background: rgba(0,0,0,0.3); display: flex; justify-content: space-between; align-items: center; font-size: 11px; }
</style>

<div class="succ-wrap">
  <div class="succ-card">
    <div class="succ-header">
      <div>
        <div class="succ-sub">FATIMA-MD SUCCESS</div>
        <div class="succ-title-top">Download Complete ✅</div>
      </div>
      <div>
        <span style="background: rgba(0,255,135,0.15); border: 1px solid rgba(0,255,135,0.4); color: #00ff87; padding: 4px 10px; border-radius: 20px; font-weight: 800; font-size: 10px;">SUCCESS</span>
      </div>
    </div>
    <div class="succ-body">
      <img src="${thumbnail}" class="succ-thumb" alt="Thumbnail">
      <div class="succ-info">
        <div class="song-title" title="${videoTitle}">${displayTitle}</div>
        <div class="song-detail">📁 <b>Type:</b> ${selectedText === "1" ? 'Document File (.mp4)' : 'Video Stream'}</div>
        <div class="song-detail">🚀 <b>Status:</b> Successfully Sent</div>
        <div class="song-detail">📺 <b>Channel:</b> ${video.author.name}</div>
      </div>
    </div>
    <div class="succ-footer">
      <span style="color: rgba(255,255,255,0.6); font-weight: 600;">⚡ Version: <b>12.00</b></span>
      <span style="color: #ff007f; font-weight: 700;">👑 Powered by FATIMA-MD</span>
    </div>
  </div>
</div>`;

            const succId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
            const succData = {
                response_id: succId,
                sections: [{
                    view_model: {
                        primitive: {
                            __typename: "GenAIaeacdsnwHtmlPrimitive",
                            payload: successHtml,
                            trusted_sources: ["fatimamv.dev"]
                        },
                        __typename: "GenAISingleLayoutViewModel"
                    }
                }]
            };

            const succBase64 = Buffer.from(JSON.stringify(succData)).toString('base64');

            await sock.relayMessage(message.chat, {
                messageContextInfo: {
                    deviceListMetadata: {},
                    deviceListMetadataVersion: 2,
                    botMetadata: {
                        messageDisclaimerText: "",
                        botResponseId: succId,
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
                            submessages: [{ messageType: 2, messageText: "FATIMA-MD Download Success" }],
                            unifiedResponse: { data: succBase64 },
                            contextInfo: {
                                forwardingScore: 999,
                                isForwarded: true,
                                forwardedAiBotMessageInfo: { botJid: "867051314767696@bot" },
                                forwardOrigin: 4,
                                mentionedJid: [message.sender],
                                forwardedNewsletterMessageInfo: { 
                                    newsletterJid: '120363412031212190@newsletter', 
                                    newsletterName: 'ꜰᴀᴛɪᴍᴀ-ᴍᴅ ᴏғғɪᴄɪᴀʟ', 
                                    serverMessageId: 428 
                                }
                            }
                        }
                    }
                }
            }, { messageId: succId, quoted: msg });

            await sock.sendMessage(message.chat, { 
                react: { text: "✅", key: msg.key } 
            });

            sock.ev.off("messages.upsert", listener);
        };

        sock.ev.on("messages.upsert", listener);
        setTimeout(() => sock.ev.off("messages.upsert", listener), 120000);

    } catch (e) {
        console.error("Video/Drama HTML Error:", e);
        reply("❌ *Ek takneeki kharabi pesh aayi hai.*");
    }
}

// 1. VIDEO COMMAND
cmd({
    pattern: "video",
    alias: ["vid", "ytmp4"],
    desc: "Download high quality videos with HTML card design",
    category: "download",
    react: "🎥",
    filename: __filename
}, async (sock, message, m, { q, reply }) => {
    await handleVideoProcess(sock, message, m, { q, reply }, false);
});

// 2. DRAMA COMMAND
cmd({
    pattern: "drama",
    alias: ["epi"],
    desc: "Download long dramas (≥15 min) with HTML card design",
    category: "download",
    react: "🎬",
    filename: __filename
}, async (sock, message, m, { q, reply }) => {
    await handleVideoProcess(sock, message, m, { q, reply }, true);
});
