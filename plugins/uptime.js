// ꜰᴀᴛɪᴍᴀ-ᴍᴅ

import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import os from 'os';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);

const SIG = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LVZlcmlmaWNhdGlvblNpZ25hdHVyZS5NZXRhZGF0YeN55YRyad2+ZA==";
const CERT1 = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGEOvtJr968bbpKdZreOTwkk9aPN++XPE60RfuzNLkXXc7LE8BOkJOWRpo2oNXaRJ3uCNJ43HY3A+oetnvHSfcxWqmvvTSrBOI5V1NOD6RMsZ/st1XVPUx83AGps1l5jYBOYzqMNy6un2tToJ2Bt9bXRo29tWLZTu8m7TNY/hISwVpVc5tjSet5U7btPN+dMIx2UvykB1jcbWGsdklheeuz8RXSStNXzeaGvsf1lpZ/ugLE4b2BdmlRNKrY6zLE4qFtRYQoS7axOyQX+4QUyN2m9bfm7urQmn+QRSXJwMO7X5kAJJLbkVGJFt9Pm9VXPwQVrK2aaqiXlpusj+7DfDw00OULmYMmZDTqXM0nUVLxj13z0LhMQoQhhNG8utdUn4uKOFceliTZ/xiP+A54GnX9620641bqw3ctfh9NNXPsTEK8hAUD7FDqUhVntHmoEYYEHq8X1tHHZYP49/f2iezTiE8AUaoZo42/jIWQIKohOGNUib2hEqMkW8NsR8vPihvNuqPc0zKZcl6359YFQdjiiW8kCRD/rsDOr9v1eYLFZKYloFyzFqEgj+jcG/V47elOjShJ5CCPwatXwP6HIloVwtgygFsnOFmCg6Ojoivfoz8Nw1qxFwg5OU2cq/1WbWNELKnaFg4eUWCAIJ/3ZIJsEPkgemZxGhE+hdiNn9dkQYBJs1kx2BxdIkJmQ9vJSKkrMz6lTxZM3IJ9mhmKS6zYdU1ppeAao0/ayte997DQParb/AHLN79g0iW1ad0z8ir5jAl0q3a+UZPTSa4YiSqC2PZ/gfxG5wvL2mKmeKowG0RXjmEp5iNxrni+T/HRLZOoH7y0DQ24nMCPg";
const CERT2 = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGHsL0Ccm0ELINFZ2IaBhKaeWnVuh0o6nZLCioCn9xpSADzwIS5VCWO+1eVXT2atJOyf7FYlpB0/JA3Us+aQtekuIkHu/zBXijORZ4ClF4+sF3cSTNg6gY/+6iwLK/zs3bMg+GeJrcI65vXfs95Shxlb2Rd5GRT2/2yBmR6Zkf5QwMJuptUHWtM26WY7/xlkEKGFZVqOSylusiOzSALa815zC6dCiHoJNLBEKMlaZZQOk57/+OYoU5zzTaEgLhyvNFHSyAlyLQ3SGFtVHAaJZHSmmSPyJowCOB+92Gkk6SWVMsk6FbU8QJWFtlhzV/W/gZ7WzUlS/AKgN0th9/cq20ToFkW7X9c+rtYavufmuieqFhXgaMD8AGsoN9QC/HzNC9D1nydPfFYEUr9BHVy2nF5gM58Y59r2rT8p5LPARIkUp8g+5DLhyW0tdZFZ1305o4AHCayZnp5rjcU2Xi/c1Qf/djBGakmijlMs4aMzKJYD0c4Q8jdI7sNyd876K2wRD+L6KeD2QB3PtCS4P7BWAl5gh5CJ6ZBrwcaKXZqcSjEwm52MqVCgYZdapAaNYUy/QndttjLOG0wxxwuX1hIhMjPnIKZR1kwnqD5EqlHpilrnojRZvjVGN4zEKmilS8rNstt4HHs/D849W+Q6LRVWiWMs0cT2IugrX+Skxd8En7Gq52UEmuVBrSTpN+UpIu20NsVb9lsvuYh3XO441606tOEY2eKcZJdTtqrOTNqbbTk0zVn1yhbOCvmfctBNDhTwaC5QMi0P9wjU5XI9SBtkdQLizc5oqpoiHeqgb8+aJHVLcbgIJ/KLZKtRWFDfzRNM02Csx4etUUapVd2NA/L0oMs/O5T9sVj9FBJ7q99GWr3PVmxJb36mHZLXC4k1gGN9swE0LtzYsUdT5tUo9ri/hS3W/SM+F1p4Kh4QIgRcG3ciIHGN44bnDh3HDCz0fDnzKYw0bclMxZPctEyJ5gEOPF6OAkjD9dEaRGq/tEPf1k9Aub+v2dEjnfrYWAm4E5Zfhs2Xh0CT0k+SzhgKd0K/46ChJ20G5+blwpIvahvTVS68+aVIX6CwXs4tcVx6FnmVsMOOkIasfaqQLZYbNBkuLoZnQAq4j8yRekrQ==";

cmd({
    pattern: "uptime",
    alias: ["runtime", "up"],
    desc: "Check live HTML uptime dashboard with FATIMA-MD style",
    category: "utility",
    react: "⏱️",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        const formatUptime = (seconds) => {
            const days = Math.floor(seconds / (3600 * 24));
            const hours = Math.floor((seconds % (3600 * 24)) / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = Math.floor(seconds % 60);
            
            let timeString = '';
            if (days > 0) timeString += `${days}d `;
            if (hours > 0) timeString += `${hours}h `;
            if (minutes > 0) timeString += `${minutes}m `;
            timeString += `${secs}s`;
            return timeString.trim();
        };

        const rawUptime = process.uptime();
        const uptimeFormatted = formatUptime(rawUptime);
        const heapUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const rssMem = (process.memoryUsage().rss / 1024 / 1024).toFixed(2);

        const htmlPayload = `<style>
* { -webkit-tap-highlight-color: transparent; -webkit-user-select: none; user-select: none; box-sizing: border-box; }
body { margin: 0; background: transparent; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #eee; }
.up-wrap { width: 100%; max-width: 520px; margin: auto; padding: 12px; }
.up-card { background: rgba(15, 18, 28, 0.9); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255, 0, 127, 0.3); border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(255, 0, 127, 0.15), 0 0 15px rgba(0, 243, 255, 0.2); }
.up-header { padding: 14px 18px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); display: flex; justify-content: space-between; align-items: center; background: linear-gradient(90deg, rgba(255,0,127,0.08), rgba(0,243,255,0.08)); }
.up-sub { font-size: 10px; letter-spacing: 2px; color: #ff007f; font-weight: 700; text-transform: uppercase; }
.up-title { font-size: 20px; font-weight: 900; color: #fff; text-shadow: 0 0 10px rgba(255, 0, 127, 0.6); letter-spacing: 1px; }
.up-body { padding: 16px; }
.up-box { background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 14px; text-align: center; margin-bottom: 12px; }
.up-time { font-size: 26px; font-weight: 900; color: #00f3ff; text-shadow: 0 0 12px rgba(0, 243, 255, 0.6); margin-top: 4px; }
.up-grid { display: flex; gap: 10px; margin-bottom: 12px; }
.up-metric { flex: 1; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 10px; padding: 10px; text-align: center; }
.up-metric-lbl { font-size: 10px; color: rgba(255, 255, 255, 0.5); text-transform: uppercase; font-weight: 700; }
.up-metric-val { font-size: 14px; font-weight: 800; color: #fff; margin-top: 4px; }
.up-footer { font-size: 11px; color: rgba(255, 255, 255, 0.6); text-align: center; font-weight: 600; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 10px; }
</style>

<div class="up-wrap">
  <div class="up-card">
    <div class="up-header">
      <div>
        <div class="up-sub">SYSTEM STATUS</div>
        <div class="up-title">FATIMA-MD Live Uptime</div>
      </div>
      <div style="text-align: right;">
        <span style="display: inline-block; width: 10px; height: 10px; background: #00ff87; border-radius: 50%; box-shadow: 0 0 8px #00ff87;"></span>
        <span style="font-size: 11px; color: #00ff87; font-weight: bold; margin-left: 4px;">ACTIVE</span>
      </div>
    </div>
    <div class="up-body">
      <div class="up-box">
        <div style="font-size: 11px; color: rgba(255,255,255,0.6); font-weight: 700; letter-spacing: 1px;">TOTAL RUNTIME</div>
        <div class="up-time">${uptimeFormatted}</div>
      </div>
      <div class="up-grid">
        <div class="up-metric">
          <div class="up-metric-lbl">Heap Memory</div>
          <div class="up-metric-val">${heapUsed} MB</div>
        </div>
        <div class="up-metric">
          <div class="up-metric-lbl">RSS RAM</div>
          <div class="up-metric-val">${rssMem} MB</div>
        </div>
        <div class="up-metric">
          <div class="up-metric-lbl">Platform</div>
          <div class="up-metric-val">${os.platform()}</div>
        </div>
      </div>
      <div class="up-footer">
        <span>⚡ Version: <b>12.00</b></span>
        <span style="color: #ff007f;">👑 Powered by FATIMA-MD</span>
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
                        submessages: [{ messageType: 2, messageText: "FATIMA-MD Uptime Dashboard" }],
                        unifiedResponse: { data: dataBase64 },
                        contextInfo: {
                            forwardingScore: 999,
                            isForwarded: true,
                            forwardedAiBotMessageInfo: { botJid: "867051314767696@bot" },
                            forwardOrigin: 4,
                            mentionedJid: [m.sender],
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

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error("Error in uptime html command:", e);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        await reply(`❌ *Error checking uptime:* \`\`\`${e.message}\`\`\``);
    }
});
