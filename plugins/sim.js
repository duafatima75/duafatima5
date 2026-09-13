// DR KAMRAN 

import { fileURLToPath } from 'url';
import axios from 'axios';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "apk",
    desc: "Download any application or APK file",
    category: "download",
    react: "📥",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, reply }) => {
    try {
        if (!q) {
            return reply(
                `╔════════════════════════╗\n` +
                `║   📥 KAMRAN-MD APK DOWNLOADER   \n` +
                `╚════════════════════════╝\n\n` +
                `❌ *Kripya kisi app ka naam dein!*\n\n` +
                `> 📌 *Example:* \`.apk WhatsApp\`\n` +
                `> ⚡ *Version:* \`12.00\``
            );
        }

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        const url = `https://api.princetechn.com/api/download/apkdl?apikey=prince&appName=${encodeURIComponent(q)}`;
        const response = await axios.get(url, { timeout: 60000 });
        
        // Debugging ke liye console log check karein agar link na mile
        console.log("API Response:", response.data);

        if (response.data) {
            // Check different possible response structures for API data
            const resData = response.data.result || response.data.data || response.data;
            
            const appName = resData.name || resData.appName || resData.title || q;
            const appSize = resData.size || resData.fileSize || "Unknown";
            const appPackage = resData.package || resData.bundleId || resData.packagename || "Unknown";
            
            // Sabhi possible download link keys ko target kiya hai
            const downloadUrl = resData.dllink || resData.download_link || resData.download || resData.link || resData.url;
            const appIcon = resData.icon || resData.image || resData.thumbnail || "";

            if (!downloadUrl) {
                await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
                return reply(`❌ *App download link nahi mila!* \n\n\`\`\`${JSON.stringify(response.data, null, 2)}\`\`\``);
            }

            const appBox = `
╔════════════════════════╗
║   📥 KAMRAN-MD APK DOWNLOADER   
╚════════════════════════╝

📌 *App Name:* ${appName}
📦 *Package:* \`${appPackage}\`
💾 *Size:* ${appSize}

> ⚡ *Version:* \`12.00\`
> 👑 *Powered by DOCTOR MD*`.trim();

            if (appIcon) {
                await conn.sendMessage(from, { 
                    image: { url: appIcon }, 
                    caption: appBox 
                }, { quoted: mek });
            } else {
                await reply(appBox, {
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

            // Send APK Document File
            await conn.sendMessage(from, { 
                document: { url: downloadUrl }, 
                mimetype: 'application/vnd.android.package-archive', 
                fileName: `${appName}.apk`,
                caption: `> *📥 Here is your APK file:* ${appName}`
            }, { quoted: mek });

            await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        } else {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply("❌ *API se koi data nahi mila, app ka naam theek se likhein!*");
        }

    } catch (e) {
        console.error("APK Command Error:", e);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        return reply(`❌ *Error occurred:* \`\`\`${e.message}\`\`\``);
    }
});
