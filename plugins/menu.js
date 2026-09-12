// ꜰᴀᴛɪᴍᴀ-ᴍᴅ - ULTRA PRO MAX HTML MENU WITH SCROLL BUTTONS

import { fileURLToPath } from 'url';
import path from 'path';
import crypto from 'crypto';
import os from 'os';
import { cmd, commands } from '../command.js';
import config from '../config.js';
import { runtime } from '../lib/functions.js';

const __filename = fileURLToPath(import.meta.url);

const SIG = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LVZlcmlmaWNhdGlvblNpZ25hdHVyZS5NZXRhZGF0YeN55YRyad2+ZA==";
const CERT1 = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGEOvtJr968bbpKdZreOTwkk9aPN++XPE60RfuzNLkXXc7LE8BOkJOWRpo2oNXaRJ3uCNJ43HY3A+oetnvHSfcxWqmvvTSrBOI5V1NOD6RMsZ/st1XVPUx83AGps1l5jYBOYzqMNy6un2tToJ2Bt9bXRo29tWLZTu8m7TNY/hISwVpVc5tjSet5U7btPN+dMIx2UvykB1jcbWGsdklheeuz8RXSStNXzeaGvsf1lpZ/ugLE4b2BdmlRNKrY6zLE4qFtRYQoS7axOyQX+4QUyN2m9bfm7urQmn+QRSXJwMO7X5kAJJLbkVGJFt9Pm9VXPwQVrK2aaqiXlpusj+7DfDw00OULmYMmZDTqXM0nUVLxj13z0LhMQoQhhNG8utdUn4uKOFceliTZ/xiP+A54GnX9620641bqw3ctfh9NNXPsTEK8hAUD7FDqUhVntHmoEYYEHq8X1tHHZYP49/f2iezTiE8AUaoZo42/jIWQIKohOGNUib2hEqMkW8NsR8vPihvNuqPc0zKZcl6359YFQdjiiW8kCRD/rsDOr9v1eYLFZKYloFyzFqEgj+jcG/V47elOjShJ5CCPwatXwP6HIloVwtgygFsnOFmCg6Ojoivfoz8Nw1qxFwg5OU2cq/1WbWNELKnaFg4eUWCAIJ/3ZIJsEPkgemZxGhE+hdiNn9dkQYBJs1kx2BxdIkJmQ9vJSKkrMz6lTxZM3IJ9mhmKS6zYdU1ppeAao0/ayte997DQParb/AHLN79g0iW1ad0z8ir5jAl0q3a+UZPTSa4YiSqC2PZ/gfxG5wvL2mKmeKowG0RXjmEp5iNxrni+T/HRLZOoH7y0DQ24nMCPg";
const CERT2 = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGHsL0Ccm0ELINFZ2IaBhKaeWnVuh0o6nZLCioCn9xpSADzwIS5VCWO+1eVXT2atJOyf7FYlpB0/JA3Us+aQtekuIkHu/zBXijORZ4ClF4+sF3cSTNg6gY/+6iwLK/zs3bMg+GeJrcI65vXfs95Shxlb2Rd5GRT2/2yBmR6Zkf5QwMJuptUHWtM26WY7/xlkEKGFZVqOSylusiOzSALa815zC6dCiHoJNLBEKMlaZZQOk57/+OYoU5zzTaEgLhyvNFHSyAlyLQ3SGFtVHAaJZHSmmSPyJowCOB+92Gkk6SWVMsk6FbU8QJWFtlhzV/W/gZ7WzUlS/AKgN0th9/cq20ToFkW7X9c+rtYavufmuieqFhXgaMD8AGsoN9QC/HzNC9D1nydPfFYEUr9BHVy2nF5gM58Y59r2rT8p5LPARIkUp8g+5DLhyW0tdZFZ1305o4AHCayZnp5rjcU2Xi/c1Qf/djBGakmijlMs4aMzKJYD0c4Q8jdI7sNyd876K2wRD+L6KeD2QB3PtCS4P7BWAl5gh5CJ6ZBrwcaKXZqcSjEwm52MqVCgYZdapAaNYUy/QndttjLOG0wxxwuX1hIhMjPnIKZR1kwnqD5EqlHpilrnojRZvjVGN4zEKmilS8rNstt4HHs/D849W+Q6LRVWiWMs0cT2IugrX+Skxd8En7Gq52UEmuVBrSTpN+UpIu20NsVb9lsvuYh3XO441606tOEY2eKcZJdTtqrOTNqbbTk0zVn1yhbOCvmfctBNDhTwaC5QMi0P9wjU5XI9SBtkdQLizc5oqpoiHeqgb8+aJHVLcbgIJ/KLZKtRWFDfzRNM02Csx4etUUapVd2NA/L0oMs/O5T9sVj9FBJ7q99GWr3PVmxJb36mHZLXC4k1gGN9swE0LtzYsUdT5tUo9ri/hS3W/SM+F1p4Kh4QIgRcG3ciIHGN44bnDh3HDCz0fDnzKYw0bclMxZPctEyJ5gEOPF6OAkjD9dEaRGq/tEPf1k9Aub+v2dEjnfrYWAm4E5Zfhs2Xh0CT0k+SzhgKd0K/46ChJ20G5+blwpIvahvTVS68+aVIX6CwXs4tcVx6FnmVsMOOkIasfaqQLZYbNBkuLoZnQAq4j8yRekrQ==";

cmd({
    pattern: "menu",
    alias: ["m", "help", "allmenu", "fullmenu"],
    use: '.menu',
    desc: "Show interactive HTML menu with supreme FATIMA-MD design",
    category: "main",
    react: "👑",
    filename: __filename
},
async (conn, mek, m, { from, reply, userConfig }) => {
    try {
        await conn.sendMessage(from, { react: { text: '👑', key: m.key } });

        let totalCommands = Object.keys(commands).length;
        
        const categories = [...new Set(Object.values(commands).map(c => c.category))].filter(cat => 
            cat && cat.trim() !== '' && cat !== 'undefined'
        );
        
        const categorized = {};
        categories.forEach(cat => {
            const categoryCommands = Object.values(commands).filter(c => c.category === cat);
            const validCommands = categoryCommands.filter(cmd => cmd.pattern && cmd.pattern.trim() !== '');
            if (validCommands.length > 0) {
                categorized[cat] = validCommands;
            }
        });

        let menuHtmlList = '';
        for (const [category, cmds] of Object.entries(categorized)) {
            if (cmds && cmds.length > 0) {
                menuHtmlList += `<div class="menu-category">
                    <div class="category-title">👑 ${category.toUpperCase()} 👑</div>
                    <div class="cmd-grid">`;
                
                cmds.forEach(cmd => {
                    menuHtmlList += `<div class="cmd-pill">.${cmd.pattern}</div>`;
                });

                menuHtmlList += `</div></div>`;
            }
        }

        const OWNER_NAME = userConfig?.OWNER_NAME || config.OWNER_NAME || "FATIMA";
        const PREFIX = userConfig?.PREFIX || config.PREFIX || ".";
        const MODE = userConfig?.MODE || config.MODE || "public";
        const VERSION = "12.00";
        const botUptime = runtime(process.uptime());

        const htmlPayload = `<style>
* { -webkit-tap-highlight-color: transparent; -webkit-user-select: none; user-select: none; box-sizing: border-box; }
body { margin: 0; background: transparent; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #eee; }
.menu-wrap { width: 100%; max-width: 580px; margin: auto; padding: 12px; }
.menu-card { background: rgba(15, 18, 28, 0.92); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); border: 1px solid rgba(255, 0, 127, 0.35); border-radius: 18px; overflow: hidden; box-shadow: 0 8px 32px rgba(255, 0, 127, 0.2), 0 0 20px rgba(0, 243, 255, 0.25); }
.menu-header { padding: 16px 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); display: flex; justify-content: space-between; align-items: center; background: linear-gradient(90deg, rgba(255,0,127,0.1), rgba(0,243,255,0.1)); }
.menu-sub { font-size: 10px; letter-spacing: 2px; color: #ff007f; font-weight: 700; text-transform: uppercase; }
.menu-title { font-size: 22px; font-weight: 900; color: #fff; text-shadow: 0 0 12px rgba(255, 0, 127, 0.7); letter-spacing: 1px; }
.menu-body { padding: 16px; height: 380px; overflow-y: auto; -webkit-overflow-scrolling: touch; scroll-behavior: smooth; scrollbar-width: thin; }
.menu-body::-webkit-scrollbar { width: 4px; }
.menu-body::-webkit-scrollbar-thumb { background: rgba(255, 0, 127, 0.4); border-radius: 4px; }
.info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 16px; }
.info-box { background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 10px 14px; }
.info-lbl { font-size: 10px; color: rgba(255, 255, 255, 0.5); font-weight: 700; text-transform: uppercase; }
.info-val { font-size: 13px; font-weight: 800; color: #00f3ff; margin-top: 3px; text-shadow: 0 0 8px rgba(0,243,255,0.4); }
.menu-category { margin-bottom: 14px; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 12px; }
.category-title { font-size: 13px; font-weight: 900; color: #ff007f; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; text-align: center; text-shadow: 0 0 8px rgba(255,0,127,0.5); }
.cmd-grid { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; }
.cmd-pill { background: rgba(0, 243, 255, 0.08); border: 1px solid rgba(0, 243, 255, 0.25); border-radius: 8px; padding: 5px 10px; font-size: 11px; font-weight: 700; color: #fff; box-shadow: 0 0 6px rgba(0,243,255,0.15); }
.menu-footer { border-top: 1px solid rgba(255, 255, 255, 0.1); padding: 12px 16px; background: rgba(0,0,0,0.3); }
.footer-info { font-size: 11px; color: rgba(255, 255, 255, 0.7); display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-weight: 600; }
.scroll-btns { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 8px; }
.scroll-btn { background: rgba(0, 243, 255, 0.15); border: 1px solid rgba(0, 243, 255, 0.4); border-radius: 8px; padding: 7px; text-align: center; color: #00f3ff; font-size: 11px; font-weight: 800; text-transform: uppercase; cursor: pointer; text-shadow: 0 0 6px rgba(0,243,255,0.6); }
.btn-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.action-btn { background: linear-gradient(135deg, rgba(255,0,127,0.2), rgba(0,243,255,0.2)); border: 1px solid rgba(255, 0, 127, 0.4); border-radius: 10px; padding: 10px; text-align: center; color: #fff; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; text-shadow: 0 0 6px rgba(255,0,127,0.6); box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
</style>

<div class="menu-wrap">
  <div class="menu-card">
    <div class="menu-header">
      <div>
        <div class="menu-sub">ULTRA PRO MAX EXPERIENCE</div>
        <div class="menu-title">FATIMA-MD V${VERSION}</div>
      </div>
      <div style="text-align: right;">
        <span style="display: inline-block; width: 10px; height: 10px; background: #00ff87; border-radius: 50%; box-shadow: 0 0 8px #00ff87;"></span>
        <span style="font-size: 11px; color: #00ff87; font-weight: bold; margin-left: 4px;">ONLINE</span>
      </div>
    </div>
    <div class="menu-body" id="menuBody">
      <div class="info-grid">
        <div class="info-box">
          <div class="info-lbl">Owner</div>
          <div class="info-val">${OWNER_NAME}</div>
        </div>
        <div class="info-box">
          <div class="info-lbl">Total Commands</div>
          <div class="info-val">${totalCommands}</div>
        </div>
        <div class="info-box">
          <div class="info-lbl">Bot Runtime</div>
          <div class="info-val">${botUptime}</div>
        </div>
        <div class="info-box">
          <div class="info-lbl">System Mode</div>
          <div class="info-val">${MODE.toUpperCase()}</div>
        </div>
        <div class="info-box">
          <div class="info-lbl">Command Prefix</div>
          <div class="info-val">[ ${PREFIX} ]</div>
        </div>
        <div class="info-box">
          <div class="info-lbl">System Version</div>
          <div class="info-val">V${VERSION}</div>
        </div>
      </div>
      ${menuHtmlList}
    </div>
    <div class="menu-footer">
      <div class="footer-info">
        <span>⚡ Version: <b>${VERSION}</b></span>
        <span style="color: #ff007f;">👑 Powered by FATIMA-MD</span>
      </div>
      <div class="scroll-btns">
        <div class="scroll-btn" onclick="document.getElementById('menuBody').scrollBy({top: -150, behavior: 'smooth'})">⬆️ SCROLL UP</div>
        <div class="scroll-btn" onclick="document.getElementById('menuBody').scrollBy({top: 150, behavior: 'smooth'})">⬇️ SCROLL DOWN</div>
      </div>
      <div class="btn-grid">
        <div class="action-btn">👑 OWNER</div>
        <div class="action-btn">🏓 PING</div>
        <div class="action-btn">⏱️ UPTIME</div>
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
                        submessages: [{ messageType: 2, messageText: "FATIMA-MD Interactive Menu" }],
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
        console.error("Menu HTML Command Error:", e);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        await reply(`❌ *Error:* ${e.message}`); 
    } 
});
