//---------------------------------------------------------------------------
//           JAWAD-MD - SERVER LIST FETCHER
//---------------------------------------------------------------------------
//  🖥️ FETCH SERVERS FROM SECURE BACKEND
//---------------------------------------------------------------------------

import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);

// ============================================
// SecureConfig (base64 decoder)
// ============================================
const SecureConfig = {
    decode: function (b64Str) {
        return decodeURIComponent(
            atob(b64Str)
                .split('')
                .map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join('')
        );
    }
};

// ============================================
// COMMAND: slist (Fetch server list)
// ============================================
cmd({
    pattern: "slist",
    alias: ["serverlist", "getsrv"],
    desc: "Fetch available servers list",
    category: "tools",
    react: "🖥️",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, {
            react: { text: '⏳', key: m.key }
        });

        // ---- All hidden values (base64) ----
        // base  -> https://www.kamran-md.web.id
        // ep    -> /api/v1/secure-node-fetch-9988
        // token -> KAMRAN_SECURE_TOKEN_998877
        // brand -> KAMRAN-MD
        const base  = SecureConfig.decode('aHR0cHM6Ly93d3cua2FtcmFuLW1kLndlYi5pZA==');
        const ep    = SecureConfig.decode('L2FwaS92MS9zZWN1cmUtbm9kZS1mZXRjaC05OTg4');
        const token = SecureConfig.decode('S0FNUkFOX1NFQ1VSRV9UT0tFTl85OTg4Nzc=');
        const brand = SecureConfig.decode('S0FNUkFOLU1E');

        const apiUrl = `${base}${ep}`;

        const res = await axios.get(apiUrl, {
            timeout: 20000,
            headers: {
                'x-kamran-token': token,
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (!res.data || !res.data.servers) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("❌ No servers found in the response!");
        }

        const servers = res.data.servers;
        const total = servers.length;

        // ---- Build formatted list ----
        let list = `╭┈───〔 🖥️ ${brand} SERVERS 〕┈───⊷\n`;
        list += `├▢ 📊 Total: *${total}*\n`;
        list += `├▢ 🕒 Fetched: ${new Date().toLocaleString()}\n`;
        list += `╰───────────────────⊷\n\n`;

        servers.forEach((srv, i) => {
            const num = (i + 1).toString().padStart(2, '0');
            list += `*${num}.* 🟢 ${srv.name || srv.id}\n`;
            if (srv.id && srv.name && srv.id !== srv.name) {
                list += `      └ \`${srv.id}\`\n`;
            }
        });

        list += `\n> Powered by KHAN-MD`;

        await conn.sendMessage(from, { text: list }, { quoted: mek });

        // ---- Optional: send raw JSON file too ----
        /*
        const jsonBuffer = Buffer.from(JSON.stringify(res.data, null, 2), 'utf-8');
        await conn.sendMessage(from, {
            document: jsonBuffer,
            fileName: 'servers.json',
            mimetype: 'application/json',
            caption: '📄 Raw JSON Response'
        }, { quoted: mek });
        */

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error("❌ SERVERS ERROR:", error);

        let errMsg = "❌ Failed to fetch servers.";
        if (error.code === 'ECONNABORTED') {
            errMsg = "⏰ Request timed out! Server may be offline.";
        } else if (error.response?.status === 401 || error.response?.status === 403) {
            errMsg = "🔒 Unauthorized! Invalid or expired token.";
        } else if (error.response?.status === 404) {
            errMsg = "❌ Endpoint not found. API may have changed.";
        } else if (error.message) {
            errMsg += `\n\n📛 Reason: ${error.message}`;
        }

        reply(errMsg);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});
