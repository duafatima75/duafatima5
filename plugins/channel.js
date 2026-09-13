// DR KAMRAN 

import { fileURLToPath } from 'url';
import axios from 'axios';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "wachannel",
    desc: "Stalk or get information about a WhatsApp channel",
    category: "stalker",
    react: "📊",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, reply }) => {
    try {
        // Full message body ya args se link extract karne ke liye robust logic
        let targetUrl = q;
        
        // Agar q me direct link nahi hai, toh poore message body se whatsapp channel link dhundho
        if (!targetUrl || !targetUrl.includes('whatsapp.com/channel/')) {
            const fullText = body || m.text || '';
            const match = fullText.match(/https:\/\/whatsapp\.com\/channel\/[a-zA-Z0-9_-]+/);
            if (match) {
                targetUrl = match[0];
            }
        }

        // Agar quoted message hai aur usme link hai
        if (!targetUrl && quoted && quoted.text) {
            const matchQuoted = quoted.text.match(/https:\/\/whatsapp\.com\/channel\/[a-zA-Z0-9_-]+/);
            if (matchQuoted) {
                targetUrl = matchQuoted[0];
            }
        }

        // Agar args array me koi link hai
        if (!targetUrl && args && args.length > 0) {
            const foundArg = args.find(arg => arg.includes('whatsapp.com/channel/'));
            if (foundArg) {
                targetUrl = foundArg;
            }
        }

        if (!targetUrl) {
            return reply(
                `╔════════════════════════╗\n` +
                `║   📊 KAMRAN-MD WA CHANNEL STALK 📊   \n` +
                `╚════════════════════════╝\n\n` +
                `❌ *Kripya WhatsApp channel ka link dein!*\n\n` +
                `> 📌 *Example:* \`.wachannel https://whatsapp.com/channel/...\`\n` +
                `> ⚡ *Version:* \`12.00\``
            );
        }

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        const url = `https://api.princetechn.com/api/stalk/wachannel?apikey=prince&url=${encodeURIComponent(targetUrl)}`;
        const response = await axios.get(url, { timeout: 60000 });
        
        if (response.data) {
            const resData = response.data.result || response.data;
            
            const channelName = resData.name || resData.channelName || "Unknown";
            const channelDesc = resData.description || resData.desc || "No description";
            const followers = resData.followers || resData.subscribers || resData.members || "Unknown";
            const verified = resData.verified ? "✅ Verified" : "❌ Not Verified";
            const channelImage = resData.image || resData.icon || "";

            const channelBox = `
╔════════════════════════╗
║   📊 WA CHANNEL INFO STALK   
╚════════════════════════╝

📌 *Name:* ${channelName}
👥 *Followers:* ${followers}
🛡️ *Status:* ${verified}
📝 *Description:* ${channelDesc}

> ⚡ *Version:* \`12.00\`
> 👑 *Powered by DOCTOR MD*`.trim();

            if (channelImage) {
                await conn.sendMessage(from, { 
                    image: { url: channelImage }, 
                    caption: channelBox 
                }, { quoted: mek });
            } else {
                await reply(channelBox, {
                    contextInfo: { 
                        forwardingScore: 999, 
                        isForwarded: true, 
                        forwardedNewsletterMessageInfo: { 
                            newsletterJid: '1203634120312190@newsletter', 
                            newsletterName: 'DR KAMRAN', 
                            serverMessageId: 143 
                        } 
                    }
                });
            }

            await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        } else {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply("❌ *API se koi data nahi mila, link theek se check karein!*");
        }

    } catch (e) {
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        return reply("❌ *Kuch galat ho gaya, kripya thodi der baad koshish karein!*");
    }
});
