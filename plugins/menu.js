// ꜰᴀᴛɪᴍᴀ-ᴍᴅ - ULTRA PRO MAX MENU (100% WORKING BUTTONS)

import { fileURLToPath } from 'url';
import path from 'path';
import axios from 'axios';
import baileys from 'baileys';
import { cmd, commands } from '../command.js';
import config from '../config.js';
import { runtime } from '../lib/functions.js';

const { generateWAMessageFromContent, prepareWAMessageMedia } = baileys;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const toStylistUpper = (text) => {
    if (!text || typeof text !== 'string') return '';
    const uppercaseMap = {
        'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ғ', 'g': 'ɢ', 'h': 'ʜ', 'i': 'ɪ',
        'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ', 'q': 'ǫ', 'r': 'ʀ',
        's': 's', 't': 'ᴛ', 'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 'y': 'ʏ', 'z': 'ᴢ'
    };
    return text.split('').map(char => uppercaseMap[char.toLowerCase()] || char).join('');
};

const isValidImageUrl = (url) => {
    if (!url || typeof url !== 'string' || url.trim() === '') return false;
    const urlLower = url.toLowerCase();
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some(ext => urlLower.endsWith(ext));
};

cmd({
    pattern: "menu",
    alias: ["m", "help", "allmenu", "fullmenu"],
    use: '.menu',
    desc: "Show all bot commands with interactive native buttons",
    category: "main",
    react: "👑",
    filename: __filename
},
async (conn, mek, m, { from, reply, userConfig }) => {
    try {
        await conn.sendPresenceUpdate('composing', from);
        
        const totalCommands = Object.keys(commands).length;
        const categories = [...new Set(Object.values(commands).map(c => c.category))].filter(cat => 
            cat && cat.trim() !== '' && cat !== 'undefined'
        );

        const OWNER_NAME = userConfig?.OWNER_NAME || config.OWNER_NAME || "Dr Kamran";
        const PREFIX = userConfig?.PREFIX || config.PREFIX || ".";
        const MODE = userConfig?.MODE || config.MODE || "public";
        const VERSION = "12.00";
        
        const BOT_IMAGE = userConfig?.BOT_IMAGE || userConfig?.BOT_MEDIA_URL || config.BOT_IMAGE || config.BOT_MEDIA_URL;

        let imageToUse;
        const localImagePath = path.join(__dirname, '../lib/jawadmd.jpg');
        
        if (isValidImageUrl(BOT_IMAGE)) {
            try {
                await axios.head(BOT_IMAGE, { timeout: 3000 });
                imageToUse = BOT_IMAGE;
            } catch (e) {
                imageToUse = localImagePath;
            }
        } else {
            imageToUse = localImagePath;
        }

        // Prepare Media Attachment
        let mediaHeader = {};
        try {
            mediaHeader = await prepareWAMessageMedia(
                { image: { url: imageToUse } },
                { upload: conn.waUploadToServer }
            );
        } catch (e) {
            console.error("Media Prep Error:", e);
        }

        // Build Dynamic Row List for Categories
        const rows = categories.map(cat => {
            const count = Object.values(commands).filter(c => c.category === cat && c.pattern).length;
            return {
                header: `⚡ ${toStylistUpper(cat.toUpperCase())}`,
                title: `Show ${cat} commands`,
                description: `Total Commands: ${count}`,
                id: `${PREFIX}menu ${cat}`
            };
        });

        const bodyText = `
╭━━━〔 👑 *FATIMA-MD V12.00* 👑 〕━━━┈⊷
┃ 👤 *Owner:* \`${OWNER_NAME}\`
┃ ⚡ *Commands:* \`${totalCommands}\`
┃ ⏳ *Runtime:* \`${runtime(process.uptime())}\`
┃ 📡 *Prefix:* \`[ ${PREFIX} ]\`
┃ ⚙️ *Mode:* \`${MODE}\`
┃ 🏷️ *Version:* \`${VERSION}\`
╰━━━━━━━━━━━━━━━━━━━━━━━━━━┈⊷

> Niche diye gaye *CLICK HERE TO OPEN MENU* button par click karein.`.trim();

        // Native Interactive Payload Setup
        const msg = generateWAMessageFromContent(
            from,
            {
                interactiveMessage: {
                    body: { text: bodyText },
                    footer: { text: '⚡ Powered by FATIMA-MD' },
                    header: {
                        title: '👑 FATIMA-MD OFFICIAL',
                        hasMediaAttachment: true,
                        ...mediaHeader
                    },
                    nativeFlowMessage: {
                        buttons: [
                            {
                                name: 'quick_reply',
                                buttonParamsJson: JSON.stringify({
                                    display_text: '🏓 PING',
                                    id: `${PREFIX}ping`
                                })
                            },
                            {
                                name: 'quick_reply',
                                buttonParamsJson: JSON.stringify({
                                    display_text: '👤 OWNER',
                                    id: `${PREFIX}owner`
                                })
                            },
                            {
                                name: 'single_select',
                                buttonParamsJson: JSON.stringify({
                                    title: 'CLICK HERE TO OPEN MENU 📜',
                                    sections: [
                                        {
                                            title: 'MAIN MENU CATEGORIES',
                                            highlight_label: 'POPULAR',
                                            rows: rows
                                        }
                                    ]
                                })
                            }
                        ]
                    },
                    contextInfo: {
                        mentionedJid: [m.sender],
                        forwardingScore: 999,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363412031212190@newsletter',
                            newsletterName: 'ꜰᴀᴛɪᴍᴀ-ᴍᴅ ᴏғғɪᴄɪᴀʟ',
                            serverMessageId: 143
                        }
                    }
                }
            },
            { quoted: mek }
        );

        // Relay Message via Socket
        await conn.relayMessage(from, msg.message, {
            messageId: msg.key.id,
            additionalNodes: [
                {
                    tag: 'biz',
                    attrs: {},
                    content: [
                        {
                            tag: 'interactive',
                            attrs: { type: 'native_flow', v: '1' },
                            content: [{ tag: 'native_flow', attrs: { v: '9', name: 'mixed' } }]
                        }
                    ]
                }
            ]
        });

    } catch (e) { 
        console.error("Menu Command Error:", e);
        reply(`❌ *Error:* ${e.message}`); 
    } 
});
