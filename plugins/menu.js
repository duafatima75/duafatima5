// ꜰᴀᴛɪᴍᴀ-ᴍᴅ - ULTRA PRO MAX MENU WITH BUILT-IN BUTTON CLASS

import { fileURLToPath } from 'url';
import path from 'path';
import axios from 'axios';
import sharp from 'sharp';
import { generateWAMessageFromContent, prepareWAMessageMedia } from 'baileys';
import { cmd, commands } from '../command.js';
import config from '../config.js';
import { runtime } from '../lib/functions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= BUILT-IN BUTTON BUILDERS =================
class BaseBuilder {
    constructor() {
        this._title = '';
        this._subtitle = '';
        this._body = '';
        this._footer = '';
        this._contextInfo = {};
        this._extraPayload = {};
    }

    setTitle(title) {
        this._title = title;
        return this;
    }

    setSubtitle(subtitle) {
        this._subtitle = subtitle;
        return this;
    }

    setBody(body) {
        this._body = body;
        return this;
    }

    setFooter(footer) {
        this._footer = footer;
        return this;
    }

    setContextInfo(obj) {
        this._contextInfo = obj;
        return this;
    }
}

class InlineButton extends BaseBuilder {
    #client;

    constructor(client) {
        super();
        if (!client) throw new Error('Socket/Client is required');
        this.#client = client;
        this._buttons = [];
        this._data = null;
        this._currentSelectionIndex = -1;
        this._currentSectionIndex = -1;
    }

    setImage(path) {
        if (!path) return this;
        Buffer.isBuffer(path) ? (this._data = { image: path }) : (this._data = { image: { url: path } });
        return this;
    }

    addReply(display_text = '', id = '') {
        this._buttons.push({
            name: 'quick_reply',
            buttonParamsJson: JSON.stringify({ display_text, id }),
        });
        return this;
    }

    addSelection(title) {
        this._buttons.push({
            name: 'single_select',
            buttonParamsJson: JSON.stringify({ title, sections: [] })
        });
        this._currentSelectionIndex = this._buttons.length - 1;
        this._currentSectionIndex = -1;
        return this;
    }

    makeSection(title = '', highlight_label = '') {
        if (this._currentSelectionIndex === -1) return this;
        const buttonParams = JSON.parse(this._buttons[this._currentSelectionIndex].buttonParamsJson);
        buttonParams.sections.push({ title, highlight_label, rows: [] });
        this._currentSectionIndex = buttonParams.sections.length - 1;
        this._buttons[this._currentSelectionIndex].buttonParamsJson = JSON.stringify(buttonParams);
        return this;
    }

    makeRow(header = '', title = '', description = '', id = '') {
        if (this._currentSelectionIndex === -1 || this._currentSectionIndex === -1) return this;
        const buttonParams = JSON.parse(this._buttons[this._currentSelectionIndex].buttonParamsJson);
        buttonParams.sections[this._currentSectionIndex].rows.push({ header, title, description, id });
        this._buttons[this._currentSelectionIndex].buttonParamsJson = JSON.stringify(buttonParams);
        return this;
    }

    async build(jid, options = {}) {
        const message = {
            body: { text: this._body },
            footer: { text: this._footer },
            header: {
                title: this._title,
                subtitle: this._subtitle,
                hasMediaAttachment: !!this._data,
                ...(this._data ? await prepareWAMessageMedia(this._data, { upload: this.#client.waUploadToServer }).catch(() => ({})) : {}),
            },
            nativeFlowMessage: {
                buttons: this._buttons,
            },
        };

        return generateWAMessageFromContent(
            jid,
            {
                ...this._extraPayload,
                interactiveMessage: {
                    ...message,
                    contextInfo: this._contextInfo,
                },
            },
            { ...options }
        );
    }

    async send(jid, options = {}) {
        const msg = await this.build(jid, options);
        await this.#client.relayMessage(msg.key.remoteJid, msg.message, {
            messageId: msg.key.id,
            additionalNodes: [
                {
                    tag: 'biz',
                    attrs: {},
                    content: [
                        {
                            tag: 'interactive',
                            attrs: { type: 'native_flow', v: '1' },
                            content: [{ tag: 'native_flow', attrs: { v: '9', name: 'mixed' } }],
                        },
                    ],
                },
            ],
            ...options,
        });
        return msg;
    }
}

// ================= STYLIST & HELPER FUNCTIONS =================
const toStylistUpper = (text) => {
    if (!text || typeof text !== 'string') return '';
    const uppercaseMap = {
        'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ғ', 'g': 'ɢ', 'h': 'ʜ', 'i': 'ɪ',
        'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ', 'q': 'ǫ', 'r': 'ʀ',
        's': 's', 't': 'ᴛ', 'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 'y': 'ʏ', 'z': 'ᴢ',
        'A': 'ᴀ', 'B': 'ʙ', 'C': 'ᴄ', 'D': 'ᴅ', 'E': 'ᴇ', 'F': 'ғ', 'G': 'ɢ', 'H': 'ʜ', 'I': 'ɪ',
        'J': 'ᴊ', 'K': 'ᴋ', 'L': 'ʟ', 'M': 'ᴍ', 'N': 'ɴ', 'O': 'ᴏ', 'P': 'ᴘ', 'Q': 'ǫ', 'R': 'ʀ',
        'S': 's', 'T': 'ᴛ', 'U': 'ᴜ', 'V': 'ᴠ', 'W': 'ᴡ', 'X': 'x', 'Y': 'ʏ', 'Z': 'ᴢ'
    };
    return text.split('').map(char => uppercaseMap[char] || char).join('');
};

const formatCategory = (category, cmds) => {
    const validCmds = cmds.filter(cmd => cmd.pattern && cmd.pattern.trim() !== '');
    if (validCmds.length === 0) return '';
    
    let title = `\n┏━━━❮ 💎 *${toStylistUpper(category.toUpperCase())}* ❯━━━┈⊷\n`;
    let body = validCmds.map(cmd => {
        const commandName = toStylistUpper(cmd.pattern || '');
        return `┃ ⚡ \`${commandName}\``;
    }).join('\n');
    let footer = `\n┗━━━━━━━━━━━━━━━━━━━┈⊷`;
    return `${title}${body}${footer}`;
};

const isValidImageUrl = (url) => {
    if (!url || typeof url !== 'string' || url.trim() === '') return false;
    const urlLower = url.toLowerCase();
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some(ext => urlLower.endsWith(ext));
};

// ================= MENU COMMAND HANDLER =================
cmd({
    pattern: "menu",
    alias: ["m", "help", "allmenu", "fullmenu"],
    use: '.menu',
    desc: "Show all bot commands with supreme FATIMA-MD design",
    category: "main",
    react: "👑",
    filename: __filename
},
async (conn, mek, m, { from, reply, userConfig }) => {
    try {
        await conn.sendPresenceUpdate('composing', from);
        
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

        let menuSections = '';
        for (const [category, cmds] of Object.entries(categorized)) {
            if (cmds && cmds.length > 0) {
                const section = formatCategory(category, cmds);
                if (section !== '') {
                    menuSections += section;
                }
            }
        }

        const OWNER_NAME = userConfig?.OWNER_NAME || config.OWNER_NAME || "FATIMA";
        const PREFIX = userConfig?.PREFIX || config.PREFIX || ".";
        const MODE = userConfig?.MODE || config.MODE || "public";
        const VERSION = "12.00";
        
        const BOT_IMAGE = userConfig?.BOT_IMAGE || userConfig?.BOT_MEDIA_URL || config.BOT_IMAGE || config.BOT_MEDIA_URL;
        
        let dec = `
╭━━━〔 👑 *FATIMA-MD V12.00* 👑 〕━━━┈⊷
┃ 👤 *Owner:* \`${OWNER_NAME}\`
┃ ⚡ *Commands:* \`${totalCommands}\`
┃ ⏳ *Runtime:* \`${runtime(process.uptime())}\`
┃ 📡 *Prefix:* \`[ ${PREFIX} ]\`
┃ ⚙️ *Mode:* \`${MODE}\`
┃ 🏷️ *Version:* \`${VERSION}\`
╰━━━━━━━━━━━━━━━━━━━━━━━━━━┈⊷
${menuSections}

━━━━━━━━━━━━━━━━━━━━━━━━━━
> ⚡ *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*
> 👑 *The Ultimate WhatsApp Bot Experience*`.trim();

        let imageToUse;
        const localImagePath = path.join(__dirname, '../lib/jawadmd.jpg');
        
        if (isValidImageUrl(BOT_IMAGE)) {
            try {
                await axios.head(BOT_IMAGE, { timeout: 3000 });
                imageToUse = BOT_IMAGE;
            } catch (serverError) {
                imageToUse = localImagePath;
            }
        } else {
            imageToUse = localImagePath;
        }

        // ================= SEND WITH BUTTONS =================
        const btn = new InlineButton(conn)
            .setTitle('👑 FATIMA-MD OFFICIAL MENU')
            .setBody(dec)
            .setFooter('ꜰᴀᴛɪᴍᴀ-ᴍᴅ ᴏғғɪᴄɪᴀʟ')
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

        // Quick Buttons
        btn.addReply('🏓 PING', `${PREFIX}ping`);
        btn.addReply('👤 OWNER', `${PREFIX}owner`);

        // Select List Dropdown
        btn.addSelection('☰ SELECT CATEGORY');
        btn.makeSection('MAIN MENU CATEGORIES');

        for (const cat of categories) {
            btn.makeRow(
                `⚡ ${toStylistUpper(cat.toUpperCase())}`, 
                `Show all ${cat} commands`, 
                '', 
                `${PREFIX}menu ${cat}`
            );
        }

        await btn.send(from, { quoted: mek });

    } catch (e) { 
        console.error("Menu Command Error:", e);
        reply(`❌ *Error:* ${e.message}`); 
    } 
});
