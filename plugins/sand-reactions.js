// ꜰᴀᴛɪᴍᴀ-ᴍᴅ

import { cmd } from '../command.js';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { tmpdir } from 'os';
import crypto from 'crypto';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

ffmpeg.setFfmpegPath(ffmpegPath.path);

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

async function fetchGif(url) {
    try {
        const response = await axios.get(url, { 
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': USER_AGENT,
                'Accept': 'image/webp,image/*,*/*;q=0.8'
            },
            timeout: 15000
        });
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching GIF:", error.message);
        throw new Error("Could not fetch GIF.");
    }
}

async function gifToVideo(gifBuffer) {
    const filename = crypto.randomBytes(6).toString('hex');
    const gifPath = path.join(tmpdir(), `${filename}.gif`);
    const mp4Path = path.join(tmpdir(), `${filename}.mp4`);

    fs.writeFileSync(gifPath, gifBuffer);

    await new Promise((resolve, reject) => {
        ffmpeg(gifPath)
            .outputOptions([
                "-movflags faststart",
                "-pix_fmt yuv420p",
                "-vf scale=trunc(iw/2)*2:trunc(ih/2)*2"
            ])
            .on("error", (err) => {
                console.error("❌ ffmpeg conversion error:", err);
                reject(new Error("Could not process GIF to video."));
            })
            .on("end", resolve)
            .save(mp4Path);
    });

    const videoBuffer = fs.readFileSync(mp4Path);
    fs.unlinkSync(gifPath);
    fs.unlinkSync(mp4Path);

    return videoBuffer;
}

async function getNekosGif(action) {
    try {
        const apiUrl = `https://nekos.best/api/v2/${action}`;
        const response = await axios.get(apiUrl, {
            headers: {
                'User-Agent': USER_AGENT,
                'Accept': 'application/json'
            },
            timeout: 10000
        });
        return response.data.results[0].url;
    } catch (error) {
        console.log('⚠️ Nekos.Best failed, trying NekoAPI...');
        const apiUrl = `https://nekos.life/api/v2/img/${action}`;
        const response = await axios.get(apiUrl, {
            headers: {
                'User-Agent': USER_AGENT
            }
        });
        return response.data.url;
    }
}

// All Action Commands Array mapped to FATIMA-MD style
const actions = [
    { pattern: "lurk", desc: "Send a lurk reaction GIF.", react: "👀" },
    { pattern: "shoot", desc: "Send a shoot reaction GIF.", react: "🔫" },
    { pattern: "sleep", desc: "Send a sleep reaction GIF.", react: "😴" },
    { pattern: "clap", desc: "Send a clap reaction GIF.", react: "👏" },
    { pattern: "shrug", desc: "Send a shrug reaction GIF.", react: "🤷" },
    { pattern: "stare", desc: "Send a stare reaction GIF.", react: "👀" },
    { pattern: "wave", desc: "Send a wave reaction GIF.", react: "👋" },
    { pattern: "poke", desc: "Send a poke reaction GIF.", react: "👉" },
    { pattern: "confused", desc: "Send a confused reaction GIF.", react: "😕" },
    { pattern: "smile", desc: "Send a smile reaction GIF.", react: "😁" },
    { pattern: "peck", desc: "Send a peck reaction GIF.", react: "🐦" },
    { pattern: "wink", desc: "Send a wink reaction GIF.", react: "😉" },
    { pattern: "sip", desc: "Send a sip reaction GIF.", react: "☕" },
    { pattern: "blush", desc: "Send a blush reaction GIF.", react: "😊" },
    { pattern: "smug", desc: "Send a smug reaction GIF.", react: "😏" },
    { pattern: "tickle", desc: "Send a tickle reaction GIF.", react: "🤣" },
    { pattern: "yeet", desc: "Send a yeet reaction GIF.", react: "💨" },
    { pattern: "think", desc: "Send a think reaction GIF.", react: "🤔" },
    { pattern: "highfive", desc: "Send a high-five reaction GIF.", react: "✋" },
    { pattern: "feed", desc: "Send a feed reaction GIF.", react: "🍕" },
    { pattern: "wag", desc: "Send a wag reaction GIF.", react: "🐕" },
    { pattern: "bite", desc: "Send a bite reaction GIF.", react: "🦷" },
    { pattern: "teehee", desc: "Send a teehee reaction GIF.", react: "😜" },
    { pattern: "shocked", desc: "Send a shocked reaction GIF.", react: "😮" },
    { pattern: "bleh", desc: "Send a bleh reaction GIF.", react: "😝" },
    { pattern: "bored", desc: "Send a bored reaction GIF.", react: "😑" },
    { pattern: "nom", desc: "Send a nom reaction GIF.", react: "🍽️" },
    { pattern: "nya", desc: "Send a nya reaction GIF.", react: "🐱" },
    { pattern: "yawn", desc: "Send a yawn reaction GIF.", react: "🥱" },
    { pattern: "facepalm", desc: "Send a facepalm reaction GIF.", react: "🤦" },
    { pattern: "cuddle", desc: "Send a cuddle reaction GIF.", react: "🤗" },
    { pattern: "kick", desc: "Send a kick reaction GIF.", react: "🦶" },
    { pattern: "happy", desc: "Send a happy reaction GIF.", react: "😄" },
    { pattern: "carry", desc: "Send a carry reaction GIF.", react: "🏃" },
    { pattern: "hug", desc: "Send a hug reaction GIF.", react: "🤗" },
    { pattern: "kabedon", desc: "Send a kabedon reaction GIF.", react: "🧱" },
    { pattern: "baka", desc: "Send a baka reaction GIF.", react: "😤" },
    { pattern: "bonk", desc: "Send a bonk reaction GIF.", react: "🔨" },
    { pattern: "pat", desc: "Send a pat reaction GIF.", react: "🫂" },
    { pattern: "angry", desc: "Send an angry reaction GIF.", react: "😡" },
    { pattern: "spin", desc: "Send a spin reaction GIF.", react: "🔄" },
    { pattern: "shake", desc: "Send a shake reaction GIF.", react: "🤝" },
    { pattern: "run", desc: "Send a run reaction GIF.", react: "🏃" },
    { pattern: "nod", desc: "Send a nod reaction GIF.", react: "🙂" },
    { pattern: "nope", desc: "Send a nope reaction GIF.", react: "🙅" },
    { pattern: "kiss", desc: "Send a kiss reaction GIF.", react: "💋" },
    { pattern: "dance", desc: "Send a dance reaction GIF.", react: "💃" },
    { pattern: "punch", desc: "Send a punch reaction GIF.", react: "👊" },
    { pattern: "handshake", desc: "Send a handshake reaction GIF.", react: "🤝" },
    { pattern: "slap", desc: "Send a slap reaction GIF.", react: "✊" },
    { pattern: "cry", desc: "Send a crying reaction GIF.", react: "😢" },
    { pattern: "lappillow", desc: "Send a lappillow reaction GIF.", react: "🛏️" },
    { pattern: "pout", desc: "Send a pout reaction GIF.", react: "😤" },
    { pattern: "blowkiss", desc: "Send a blowkiss reaction GIF.", react: "😘" },
    { pattern: "handhold", desc: "Send a hand-holding reaction GIF.", react: "🤝" },
    { pattern: "salute", desc: "Send a salute reaction GIF.", react: "🫡" },
    { pattern: "thumbsup", desc: "Send a thumbsup reaction GIF.", react: "👍" },
    { pattern: "laugh", desc: "Send a laugh reaction GIF.", react: "😂" },
    { pattern: "tableflip", desc: "Send a tableflip reaction GIF.", react: "(╯°□°)╯︵┻━┻" },
    { pattern: "kids", desc: "Send a kids reaction GIF.", react: "👶" }
];

for (const act of actions) {
    cmd({
        pattern: act.pattern,
        desc: act.desc,
        category: "fun",
        react: act.react,
        filename: __filename,
        use: "@tag (optional)",
    }, async (conn, mek, m, { args, q, reply }) => {
        try {
            let sender = `@${mek.sender.split("@")[0]}`;
            let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
            let isGroup = m.isGroup;

            let actionText = act.pattern;
            let message = mentionedUser
                ? `${sender} is ${actionText}ing @${mentionedUser.split("@")[0]}`
                : isGroup
                ? `${sender} is ${actionText}ing everyone!`
                : `> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`;

            let gifUrl = await getNekosGif(act.pattern === 'kids' ? 'kiss' : act.pattern);
            let gifBuffer = await fetchGif(gifUrl);
            let videoBuffer = await gifToVideo(gifBuffer);
            
            await conn.sendMessage(
                mek.chat,
                { 
                    video: videoBuffer, 
                    caption: `
╔════════════════════════╗
║   🎭 FATIMA-MD ACTION  🎭   
╚════════════════════════╝
 ${message}
━━━━━━━━━━━━━━━━━━━━━━━━━━
> ⚡ *Version:* \`12.00\`
> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`.trim(), 
                    gifPlayback: true, 
                    mentions: [mek.sender, mentionedUser].filter(Boolean),
                    contextInfo: { 
                        forwardingScore: 999, 
                        isForwarded: true, 
                        forwardedNewsletterMessageInfo: { 
                            newsletterJid: '120363412031212190@newsletter', 
                            newsletterName: 'ꜰᴀᴛɪᴍᴀ-ᴍᴅ ᴏғғɪᴄɪᴀʟ', 
                            serverMessageId: 143 
                        } 
                    } 
                },
                { quoted: mek }
            );
        } catch (error) {
            console.error(`❌ Error in .${act.pattern} command:`, error);
            reply(`❌ *Error:* \`\`\`${error.message}\`\`\``);
        }
    });
}
