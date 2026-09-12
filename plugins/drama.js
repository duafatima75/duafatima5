// ꜰᴀᴛɪᴍᴀ-ᴍᴅ - INTERACTIVE HTML PLAY / MUSIC PLAYER

import { fileURLToPath } from 'url';
import path from 'path';
import crypto from 'crypto';
import os from 'os';
import axios from 'axios';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

const SIG = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LVZlcmlmaWNhdGlvblNpZ25hdHVyZS5NZXRhZGF0YeN55YRyad2+ZA==";
const CERT1 = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGEOvtJr968bbpKdZreOTwkk9aPN++XPE60RfuzNLkXXc7LE8BOkJOWRpo2oNXaRJ3uCNJ43HY3A+oetnvHSfcxWqmvvTSrBOI5V1NOD6RMsZ/st1XVPUx83AGps1l5jYBOYzqMNy6un2tToJ2Bt9bXRo29tWLZTu8m7TNY/hISwVpVc5tjSet5U7btPN+dMIx2UvykB1jcbWGsdklheeuz8RXSStNXzeaGvsf1lpZ/ugLE4b2BdmlRNKrY6zLE4qFtRYQoS7axOyQX+4QUyN2m9bfm7urQmn+QRSXJwMO7X5kAJJLbkVGJFt9Pm9VXPwQVrK2aaqiXlpusj+7DfDw00OULmYMmZDTqXM0nUVLxj13z0LhMQoQhhNG8utdUn4uKOFceliTZ/xiP+A54GnX9620641bqw3ctfh9NNXPsTEK8hAUD7FDqUhVntHmoEYYEHq8X1tHHZYP49/f2iezTiE8AUaoZo42/jIWQIKohOGNUib2hEqMkW8NsR8vPihvNuqPc0zKZcl6359YFQdjiiW8kCRD/rsDOr9v1eYLFZKYloFyzFqEgj+jcG/V47elOjShJ5CCPwatXwP6HIloVwtgygFsnOFmCg6Ojoivfoz8Nw1qxFwg5OU2cq/1WbWNELKnaFg4eUWCAIJ/3ZIJsEPkgemZxGhE+hdiNn9dkQYBJs1kx2BxdIkJmQ9vJSKkrMz6lTxZM3IJ9mhmKS6zYdU1ppeAao0/ayte997DQParb/AHLN79g0iW1ad0z8ir5jAl0q3a+UZPTSa4YiSqC2PZ/gfxG5wvL2mKmeKowG0RXjmEp5iNxrni+T/HRLZOoH7y0DQ24nMCPg";
const CERT2 = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGHsL0Ccm0ELINFZ2IaBhKaeWnVuh0o6nZLCioCn9xpSADzwIS5VCWO+1eVXT2atJOyf7FYlpB0/JA3Us+aQtekuIkHu/zBXijORZ4ClF4+sF3cSTNg6gY/+6iwLK/zs3bMg+GeJrcI65vXfs95Shxlb2Rd5GRT2/2yBmR6Zkf5QwMJuptUHWtM26WY7/xlkEKGFZVqOSylusiOzSALa815zC6dCiHoJNLBEKMlaZZQOk57/+OYoU5zzTaEgLhyvNFHSyAlyLQ3SGFtVHAaJZHSmmSPyJowCOB+92Gkk6SWVMsk6FbU8QJWFtlhzV/W/gZ7WzUlS/AKgN0th9/cq20ToFkW7X9c+rtYavufmuieqFhXgaMD8AGsoN9QC/HzNC9D1nydPfFYEUr9BHVy2nF5gM58Y59r2rT8p5LPARIkUp8g+5DLhyW0tdZFZ1305o4AHCayZnp5rjcU2Xi/c1Qf/djBGakmijlMs4aMzKJYD0c4Q8jdI7sNyd876K2wRD+L6KeD2QB3PtCS4P7BWAl5gh5CJ6ZBrwcaKXZqcSjEwm52MqVCgYZdapAaNYUy/QndttjLOG0wxxwuX1hIhMjPnIKZR1kwnqD5EqlHpilrnojRZvjVGN4zEKmilS8rNstt4HHs/D849W+Q6LRVWiWMs0cT2IugrX+Skxd8En7Gq52UEmuVBrSTpN+UpIu20NsVb9lsvuYh3XO441606tOEY2eKcZJdTtqrOTNqbbTk0zVn1yhbOCvmfctBNDhTwaC5QMi0P9wjU5XI9SBtkdQLizc5oqpoiHeqgb8+aJHVLcbgIJ/KLZKtRWFDfzRNM02Csx4etUUapVd2NA/L0oMs/O5T9sVj9FBJ7q99GWr3PVmxJb36mHZLXC4k1gGN9swE0LtzYsUdT5tUo9ri/hS3W/SM+F1p4Kh4QIgRcG3ciIHGN44bnDh3HDCz0fDnzKYw0bclMxZPctEyJ5gEOPF6OAkjD9dEaRGq/tEPf1k9Aub+v2dEjnfrYWAm4E5Zfhs2Xh0CT0k+SzhgKd0K/46ChJ20G5+blwpIvahvTVS68+aVIX6CwXs4tcVx6FnmVsMOOkIasfaqQLZYbNBkuLoZnQAq4j8yRekrQ==";

cmd({
    pattern: "play65",
    alias: ["ytplay66", "song77", "plays"],
    desc: "Search and play songs with interactive HTML audio player",
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
        const thumbnail = info.thumbnail || 'https://i.ibb.co/3r13z6h/images.jpg';
        const duration = info.duration_timestamp || '3:45';
        const author = info.author || 'Unknown Artist';
        const displayTitle = title.length > 32 ? title.substring(0, 29) + '...' : title;

        if (!audioUrl) {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply("❌ Failed to retrieve the MP3 download link from the API response.");
        }

        const htmlPayload = `<style>
* { -webkit-tap-highlight-color: transparent; -webkit-user-select: none; user-select: none; box-sizing: border-box; }
body { margin: 0; background: transparent; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #eee; }
.aud-wrap { width: 100%; max-width: 520px; margin: auto; padding: 12px; }
.aud-card { background: rgba(15, 18, 28, 0.96); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); border: 1px solid rgba(0, 243, 255, 0.4); border-radius: 18px; overflow: hidden; box-shadow: 0 8px 32px rgba(0, 243, 255, 0.2), 0 0 20px rgba(255, 0, 127, 0.2); }
.aud-header { padding: 12px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); display: flex; justify-content: space-between; align-items: center; background: linear-gradient(90deg, rgba(0,243,255,0.1), rgba(255,0,127,0.1)); }
.aud-sub { font-size: 10px; letter-spacing: 2px; color: #00f3ff; font-weight: 700; text-transform: uppercase; }
.aud-title-top { font-size: 18px; font-weight: 900; color: #fff; text-shadow: 0 0 10px rgba(0, 243, 255, 0.6); }
.aud-body { padding: 16px; display: flex; gap: 14px; align-items: center; }
.aud-thumb-box { position: relative; width: 65px; height: 65px; border-radius: 14px; overflow: hidden; border: 2px solid rgba(0, 243, 255, 0.5); box-shadow: 0 0 12px rgba(0,243,255,0.3); flex-shrink: 0; }
.aud-thumb { width: 100%; height: 100%; object-fit: cover; }
.aud-play-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; font-size: 18px; color: #fff; cursor: pointer; }
.aud-info { flex: 1; overflow: hidden; }
.song-title { font-size: 14px; font-weight: 800; color: #fff; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-shadow: 0 0 6px rgba(255,255,255,0.3); }
.song-detail { font-size: 11px; color: rgba(255, 255, 255, 0.7); margin-bottom: 2px; font-weight: 600; display: flex; align-items: center; gap: 6px; }
.wave-box { display: flex; align-items: center; gap: 3px; height: 18px; margin-top: 6px; }
.wave-bar { width: 4px; background: #00f3ff; border-radius: 2px; animation: pulseWave 1.2s infinite ease-in-out; }
.wave-bar:nth-child(2) { animation-delay: 0.2s; background: #ff007f; }
.wave-bar:nth-child(3) { animation-delay: 0.4s; }
.wave-bar:nth-child(4) { animation-delay: 0.6s; background: #00ff87; }
.wave-bar:nth-child(5) { animation-delay: 0.8s; }
@keyframes pulseWave { 0%, 100% { height: 4px; } 50% { height: 16px; } }
.aud-footer { border-top: 1px solid rgba(255, 255, 255, 0.1); padding: 12px 16px; background: rgba(0,0,0,0.3); display: flex; justify-content: space-between; align-items: center; font-size: 11px; }
.player-controls { display: flex; align-items: center; gap: 8px; }
.ctrl-btn { background: rgba(0, 243, 255, 0.15); border: 1px solid rgba(0, 243, 255, 0.4); color: #00f3ff; padding: 5px 12px; border-radius: 8px; font-size: 11px; font-weight: 800; cursor: pointer; text-transform: uppercase; }
</style>

<div class="aud-wrap">
  <div class="aud-card">
    <div class="aud-header">
      <div>
        <div class="aud-sub">FATIMA-MD AUDIO PLAYER</div>
        <div class="aud-title-top">Music Stream 🎵</div>
      </div>
      <div>
        <span style="background: rgba(0,255,135,0.15); border: 1px solid rgba(0,255,135,0.4); color: #00ff87; padding: 4px 10px; border-radius: 20px; font-weight: 800; font-size: 10px;">READY</span>
      </div>
    </div>
    <div class="aud-body">
      <div class="aud-thumb-box">
        <img src="${thumbnail}" class="aud-thumb" alt="Thumbnail">
        <div class="aud-play-overlay">▶</div>
      </div>
      <div class="aud-info">
        <div class="song-title" title="${title}">${displayTitle}</div>
        <div class="song-detail">👤 <b>Artist:</b> ${author}</div>
        <div class="song-detail">⏱️ <b>Duration:</b> ${duration}</div>
        <div class="wave-box">
          <div class="wave-bar" style="height: 12px;"></div>
          <div class="wave-bar" style="height: 16px;"></div>
          <div class="wave-bar" style="height: 8px;"></div>
          <div class="wave-bar" style="height: 14px;"></div>
          <div class="wave-bar" style="height: 10px;"></div>
          <div class="wave-bar" style="height: 15px;"></div>
        </div>
      </div>
    </div>
    <div class="aud-footer">
      <div class="player-controls">
        <div class="ctrl-btn">▶ PLAY / ⏸ PAUSE</div>
      </div>
      <div>
        <span style="color: #ff007f; font-weight: 700;">👑 Powered by FATIMA-MD</span>
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

        await conn.relayMessage(from, {
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
                        submessages: [{ messageType: 2, messageText: "FATIMA-MD Music Player" }],
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
                                serverMessageId: 428 
                            }
                        }
                    }
                }
            }
        }, { messageId: responseId, quoted: mek });

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
                    newsletterName: "ꜰᴀᴛɪᴍᴀ-ᴍᴅ ᴏғғɪᴄɪᴀʟ",
                    serverMessageId: 428
                }
            }
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (error) {
        console.error("YTPlay HTML Error:", error);
        reply(`❌ Error: ${error.message}`);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});
