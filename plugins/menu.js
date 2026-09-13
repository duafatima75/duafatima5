// ꜰᴀᴛɪᴍᴀ-ᴍᴅ - ULTRA PRO MAX MENU WITH DIRECT BUTTON INTEGRATION

import { fileURLToPath } from 'url';
import path from 'path';
import axios from 'axios';
import { generateWAMessageFromContent, prepareWAMessageMedia } from 'baileys';
import { cmd, commands } from '../command.js';
import config from '../config.js';
import { runtime } from '../lib/functions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= BUILT-IN BUTTON CLASS =================
class NativeButton {
    constructor(client) {
        if (!client) throw new Error('Socket Client Required');
        this.client = client;
        this.title = '';
        this.body = '';
        this.footer = '';
        this.media = null;
        this.buttons = [];
        this.contextInfo = {};
        this.currentSelection = -1;
        this.currentSection = -1;
    }

    setTitle(t) { this.title = t; return this; }
    setBody(b) { this.body = b; return this; }
    setFooter(f) { this.footer = f; return this; }
    setImage(url) {
        if (url) this.media = { image: { url } };
        return this;
    }
    setContextInfo(ctx) { this.contextInfo = ctx; return this; }

    addReply(displayText, id) {
        this.buttons.push({
            name: 'quick_reply',
            buttonParamsJson: JSON.stringify({ display_text: displayText, id })
        });
        return this;
    }

    addSelection(title) {
        this.buttons.push({
            name: 'single_select',
            buttonParamsJson: JSON.stringify({ title, sections: [] })
        });
        this.currentSelection = this.buttons.length - 1;
        this.currentSection = -1;
        return this;
    }

    makeSection(title = '', highlight_label = '') {
        if (this.currentSelection === -1) return this;
        const params = JSON.parse(this.buttons[this.currentSelection].buttonParamsJson);
        params.sections.push({ title, highlight_label, rows: [] });
        this.currentSection = params.sections.length - 1;
        this.buttons[this.currentSelection].buttonParamsJson = JSON.stringify(params);
        return this;
    }

    makeRow(header = '', title = '', description = '', id = '') {
        if (this.currentSelection === -1 || this.currentSection === -1) return this;
        const params = JSON.parse(this.buttons[this.currentSelection].buttonParamsJson);
        params.sections[this.currentSection].rows.push({ header, title, description, id });
        this.buttons[this.currentSelection].buttonParamsJson = JSON.stringify(params);
        return this;
    }

    async send(jid, options = {}) {
        let mediaHeader = {};
        if (this.media) {
            try {
                mediaHeader = await prepareWAMessageMedia(this.media, { upload: this.client.waUploadToServer });
            } catch (e) {
                console.error("Media Prep Error:", e);
            }
        }

        const msg = generateWAMessageFromContent(
            jid,
            {
                interactiveMessage: {
                    body: { text: this.body },
                    footer: { text: this.footer },
                    header: {
                        title: this.title,
                        hasMediaAttachment: !!this.media,
                        ...mediaHeader
                    },
                    nativeFlowMessage: {
                        buttons: this.buttons
                    },
                    contextInfo: this.contextInfo
                }
            },
            { ...options }
        );

        await this.client.relayMessage(msg.key.remoteJid, msg.message, {
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
            ],
            ...options
        });
        return msg;
    }
}

// ================= STYLIST & HELPERS =================
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

// ================= MENU COMMAND =================
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

        const OWNER_NAME = userConfig?.OWNER_NAME || config.OWNER_NAME || "FATIMA";
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

        const bodyText = `
╭━━━〔 👑 *FATIMA-MD V12.00* 👑 〕━━━┈⊷
┃ 👤 *Owner:* \`${OWNER_NAME}\`
┃ ⚡ *Commands:* \`${totalCommands}\`
┃ ⏳ *Runtime:* \`${runtime(process.uptime())}\`
┃ 📡 *Prefix:* \`[ ${PREFIX} ]\`
┃ ⚙️ *Mode:* \`${MODE}\`
┃ 🏷️ *Version:* \`${VERSION}\`
╰━━━━━━━━━━━━━━━━━━━━━━━━━━┈⊷

> Niche diye gaye *SELECT CATEGORY* button par click karke saare commands explore karein!`.trim();

        // Native Interactive Button Creation
        const menuBtn = new NativeButton(conn)
            .setTitle('👑 FATIMA-MD OFFICIAL')
            .setBody(bodyText)
            .setFooter('⚡ Powered by FATIMA-MD')
            .setImage(imageToUse)
            .setContextInfo({
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363412031212190@newsletter',
                    newsletterName: 'ꜰᴀᴛɪᴍᴀ-ᴍᴅ ᴏғғɪᴄɪᴀʟ',
                    serverMessageId: 143
                }
            });

        // Quick Reply Buttons
        menuBtn.addReply('🏓 PING', `${PREFIX}ping`);
        menuBtn.addReply('👤 OWNER', `${PREFIX}owner`);

        // Category Dropdown Selection Menu
        menuBtn.addSelection('CLICK HERE TO OPEN MENU 📜');
        menuBtn.makeSection('BOT COMMAND CATEGORIES');

        categories.forEach(cat => {
            const count = Object.values(commands).filter(c => c.category === cat && c.pattern).length;
            menuBtn.makeRow(
                `⚡ ${toStylistUpper(cat.toUpperCase())}`,
                `Total Commands: ${count}`,
                `View all ${cat} features`,
                `${PREFIX}menu ${cat}`
            );
        });

        // Send Button Message
        await menuBtn.send(from, { quoted: mek });

    } catch (e) { 
        console.error("Menu Command Error:", e);
        reply(`❌ *Error:* ${e.message}`); 
    } 
});
