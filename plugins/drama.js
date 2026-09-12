// ꜰᴀᴛɪᴍᴀ-ᴍᴅ

import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import yts from 'yt-search';
import sharp from 'sharp';
import { 
    generateWAMessageFromContent, 
    prepareWAMessageMedia, 
    proto 
} from '@itsliaaa/baileys';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);
const execPromise = promisify(exec);

function cleanName(name = 'file') {
    return String(name)
        .replace(/[\\/:*?"<>|]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 80);
}

function pickFile(tmpDir, id) {
    return fs.readdirSync(tmpDir).find(v => v.startsWith(String(id)));
}

async function getThumb(input) {
    try {
        let buffer;

        if (Buffer.isBuffer(input)) {
            buffer = input;
        } else if (typeof input === 'string' && /^https?:\/\//i.test(input)) {
            const res = await fetch(input);
            buffer = Buffer.from(await res.arrayBuffer());
        } else {
            const res = await fetch('https://u.pone.rs/arpqzmrr.jpg');
            buffer = Buffer.from(await res.arrayBuffer());
        }

        return await sharp(buffer)
            .resize(300, 300, { fit: 'cover' })
            .jpeg({ quality: 80 })
            .toBuffer();
    } catch {
        return Buffer.alloc(0);
    }
}

async function downloadYt(url, type, id, tmpDir) {
    const output = path.join(tmpDir, `${id}.%(ext)s`);

    const format = type === 'mp4'
        ? 'bestvideo[height<=480][ext=mp4]+bestaudio[ext=m4a]/best[height<=480][ext=mp4]/best'
        : 'bestaudio[ext=m4a]/bestaudio/best';

    const cmdRun = [
        'yt-dlp',
        '--no-update',
        fs.existsSync('cookies.txt') ? '--cookies cookies.txt' : '',
        '--extractor-args "youtube:player_client=android,ios"',
        '-f', `"${format}"`,
        type === 'mp4' ? '--merge-output-format mp4' : '',
        '--no-playlist',
        '-o', `"${output}"`,
        `"${url}"`
    ].filter(Boolean).join(' ');

    await execPromise(cmdRun, {
        cwd: process.cwd(),
        maxBuffer: 1024 * 1024 * 50
    });

    const result = pickFile(tmpDir, id);
    if (!result) throw `File ${type.toUpperCase()} tidak ditemukan.`;

    return path.join(tmpDir, result);
}

async function sendNativePlay(conn, m, thumb, videos, usedPrefix, command) {
    const top = videos[0];

    const media = await prepareWAMessageMedia(
        { image: thumb },
        { upload: conn.waUploadToServer }
    );

    const sections = videos.slice(0, 10).map((v, i) => ({
        title: `#${i + 1}. ${v.title}`.slice(0, 99),
        highlight_label: v.timestamp || '-',
        rows: [
            {
                title: 'Download Audio/M4A 🎵',
                description: 'Audio biasa',
                id: `${usedPrefix + command} ${v.url} mp3`
            },
            {
                title: 'Download Video/MP4 📹',
                description: 'Video 480p',
                id: `${usedPrefix + command} ${v.url} mp4`
            }
        ]
    }));

    const msg = generateWAMessageFromContent(
        m.chat,
        {
            viewOnceMessage: {
                message: {
                    interactiveMessage: proto.Message.InteractiveMessage.create({
                        header: proto.Message.InteractiveMessage.Header.create({
                            title: '',
                            hasMediaAttachment: true,
                            imageMessage: media.imageMessage
                        }),
                        body: proto.Message.InteractiveMessage.Body.create({
                            text:
`╔════════════════════════╗
║   🤖 FATIMA-MD PLAY 🤖    
╚════════════════════════╝

🔍 *YouTube Search*

${top.title}`
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.create({
                            text:
`👤 Channel: ${top.author?.name || '-'}
⏱ Duration: ${top.timestamp || '-'}
📅 Rilis: ${top.ago || '-'}
👁️ Views: ${top.views?.toLocaleString() || '-'}
🔗 ${top.url}
━━━━━━━━━━━━━━━━━━━━━━━━━━
> ⚡ *Version:* \`12.00\`
> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`
                        }),
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                            buttons: [
                                {
                                    name: 'single_select',
                                    buttonParamsJson: JSON.stringify({
                                        title: '🔎 Pilih hasil / format download',
                                        sections
                                    })
                                }
                            ]
                        }),
                        contextInfo: {
                            mentionedJid: [m.sender],
                            stanzaId: m.key?.id,
                            participant: m.sender,
                            quotedMessage: m.message,
                            forwardingScore: 999,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: '120363412031212190@newsletter',
                                newsletterName: 'ꜰᴀᴛɪᴍᴀ-ᴍᴅ ᴏғғɪᴄɪᴀʟ',
                                serverMessageId: 143
                            }
                        }
                    })
                }
            }
        },
        { quoted: m }
    );

    await conn.relayMessage(m.chat, msg.message, {
        messageId: msg.key.id
    });
}

cmd({
    pattern: "play3",
    alias: ["ytplay"],
    desc: "Search and download YouTube media with FATIMA-MD style",
    category: "downloader",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, reply, usedPrefix }) => {
    try {
        if (!q) {
            return reply(
                `╔════════════════════════╗\n` +
                `║   🤖 FATIMA-MD PLAY 🤖    \n` +
                `╚════════════════════════╝\n\n` +
                `❌ *Kripya gana ya video ka naam dein!*\n\n` +
                `> 📌 *Example:* \`${usedPrefix + command} night changes\`\n` +
                `> ⚡ *Version:* \`12.00\``
            );
        }

        await conn.sendMessage(from, { react: { text: "🕒", key: mek.key } });

        const parseArgs = q.trim().split(/\s+/);
        const last = parseArgs[parseArgs.length - 1].toLowerCase();

        let type = '';
        if (['mp3', 'audio', 'm4a'].includes(last)) {
            type = 'mp3';
            parseArgs.pop();
        } else if (['mp4', 'video'].includes(last)) {
            type = 'mp4';
            parseArgs.pop();
        }

        let query = parseArgs.join(' ').trim();
        if (!query) {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply("❌ *Kripya gana ya video ka naam bhi likhein!*");
        }

        let data;

        if (/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(query)) {
            const search = await yts({ videoId: query.match(/(?:v=|youtu\.be\/|shorts\/)([\w-]{11})/)?.[1] });
            data = search;
        } else {
            const search = await yts(query);
            const videos = search.videos || [];

            if (!videos.length) {
                await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
                return reply("❌ *Koi video nahi mili!*");
            }

            const thumb = await getThumb(videos[0].thumbnail || global.thumb);

            if (!type) {
                await sendNativePlay(conn, mek, thumb, videos, usedPrefix, command);
                await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
                return;
            }

            data = videos[0];
        }

        if (!data?.url) {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply("❌ *Video URL nahi mil saka!*");
        }

        const thumb = await getThumb(data.thumbnail || global.thumb);

        await conn.sendMessage(from, {
            image: thumb,
            caption:
`╔════════════════════════╗
║   🤖 FATIMA-MD PLAY 🤖    
╚════════════════════════╝

🕒 *DOWNLOAD ${type.toUpperCase()}*

❀ Title:
${data.title}

❀ Duration : ${data.timestamp || '-'}
❀ Quality  : ${type === 'mp4' ? '480p' : 'Audio'}
❀ Status   : Sedang diproses...
━━━━━━━━━━━━━━━━━━━━━━━━━━
> ⚡ *Version:* \`12.00\`
> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`
        }, { quoted: mek });

        const tmpDir = path.join(process.cwd(), 'tmp');
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

        const id = Date.now();
        let filePath = '';

        try {
            filePath = await downloadYt(data.url, type, id, tmpDir);

            if (type === 'mp3') {
                await conn.sendMessage(from, {
                    audio: fs.readFileSync(filePath),
                    mimetype: 'audio/mp4',
                    ptt: false,
                    fileName: `${cleanName(data.title)}.m4a`
                }, { 
                    quoted: mek,
                    contextInfo: { 
                        forwardingScore: 999, 
                        isForwarded: true, 
                        forwardedNewsletterMessageInfo: { 
                            newsletterJid: '120363412031212190@newsletter', 
                            newsletterName: 'ꜰᴀᴛɪᴍᴀ-ᴍᴅ ᴏғғɪᴄɪᴀʟ', 
                            serverMessageId: 143 
                        } 
                    }
                });
            } else {
                await conn.sendMessage(from, {
                    video: fs.readFileSync(filePath),
                    mimetype: 'video/mp4',
                    fileName: `${cleanName(data.title)}.mp4`,
                    caption: `✅ ${data.title}\n\n> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`
                }, { 
                    quoted: mek,
                    contextInfo: { 
                        forwardingScore: 999, 
                        isForwarded: true, 
                        forwardedNewsletterMessageInfo: { 
                            newsletterJid: '120363412031212190@newsletter', 
                            newsletterName: 'ꜰᴀᴛɪᴍᴀ-ᴍᴅ ᴏғғɪᴄɪᴀʟ', 
                            serverMessageId: 143 
                        } 
                    }
                });
            }

            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        } catch (e) {
            if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);

            console.error("Play Command Error:", e);
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply(`❌ *Gagal download ${type.toUpperCase()}:*\n\`\`\`${e.message || e}\`\`\``);
        }

    } catch (e) {
        console.error("Play Command Error:", e);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        return reply(`❌ *Error occurred:* \`\`\`${e.message || e}\`\`\``);
    }
});
