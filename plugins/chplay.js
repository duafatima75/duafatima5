import { fileURLToPath } from 'url';
import axios from 'axios';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

// ============================================================
// CONFIG
// ============================================================
const CHANNEL_ID = '120363430309747294@newsletter'; 
const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbDmA5Q47Xe3xhxVZU1q'; 
const API_URL = 'https://api.neosoft.best/api/downloader/youtube-play'; 

// ============================================================
// THUMBNAIL
// ============================================================
async function getThumb(url) {
    if (!url) return null;
    try {
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            timeout: 15000
        });
        return await import('sharp').then(({ default: sharp }) =>
            sharp(Buffer.from(response.data))
                .resize(1280, 720, { fit: 'cover' })
                .jpeg({ quality: 90 })
                .toBuffer()
        );
    } catch (e) {
        console.error('[PLAYCH THUMB ERROR]', e.message);
        return null;
    }
}

// ============================================================
// HIGH QUALITY THUMBNAIL
// ============================================================
async function createHighQualityThumbnail(conn, thumb) {
    if (!thumb) return null;
    try {
        const { prepareWAMessageMedia } = await import('@itsliaaa/baileys');
        const { imageMessage } = await prepareWAMessageMedia(
            { image: thumb },
            { upload: conn.waUploadToServer, mediaTypeOverride: 'thumbnail-link' }
        );
        if (imageMessage) {
            imageMessage.width = 1280;
            imageMessage.height = 720;
        }
        return imageMessage;
    } catch (e) {
        console.error('[PLAYCH HQ THUMB ERROR]', e.message);
        return null;
    }
}

// ============================================================
// COMMAND REGISTRATION (ESM Pattern)
// ============================================================
cmd({
    pattern: "playch",
    alias: ["playchannel"],
    desc: "Play and send YouTube audio to a WhatsApp channel.",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, reply }) => {
    
    const text = q ? q.trim() : "";
    const usedPrefix = ".";

    if (!text) {
        return reply(`╭─❏ 𝗣𝗹𝗮𝘆 𝗖𝗵𝗮𝗻𝗻𝗲𝗹\n│\n│✧ Masukkan judul lagu!\n│\n│✧ Format:\n│ ${usedPrefix + command} <judul lagu>\n│\n│✧ Contoh:\n│ ${usedPrefix + command} lofi hip hop\n│\n╰──────────────❏`);
    }

    if (!CHANNEL_ID || CHANNEL_ID.includes('xxxxxxxx')) {
        return reply(`╭─❏ 𝗣𝗹𝗮𝘆 𝗖𝗵𝗮𝗻𝗻𝗲𝗹\n│\n│✧ ID Channel belum diatur!\n│\n│✧ Edit bagian:\n│ const CHANNEL_ID = '...'\n│\n╰──────────────❏`);
    }

    await m.react('⏳').catch(() => {});

    try {
        const { data } = await axios.get(API_URL, {
            params: { q: text, type: 'mp3' },
            timeout: 30000
        });

        if (!data || !data.status || !data.download) {
            throw new Error('Audio tidak ditemukan');
        }

        const title = data.title || text;
        const artist = data.artist || 'Unknown';
        const thumbnail = data.thumbnail || '';
        const source = data.source || '';
        const duration = data.durationText || '-';
        const views = Number(data.views || 0).toLocaleString('id-ID');
        const uploaded = data.uploadedAt || '-';
        const downloadUrl = data.download;

        const thumb = await getThumb(thumbnail);
        const highQualityThumbnail = await createHighQualityThumbnail(conn, thumb);

        // Download audio buffer
        const audioResponse = await axios.get(downloadUrl, {
            responseType: 'arraybuffer',
            timeout: 120000,
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });

        const audioBuffer = Buffer.from(audioResponse.data);
        if (!audioBuffer || !audioBuffer.length) {
            throw new Error('Buffer audio kosong');
        }

        const invisible = '\u200B'.repeat(400);
        const caption = ` ┈─ ◦ now playing ◦ ─┈ \n🎵 ${title} \n👤 ${artist} \n⏱️ ${duration} \n👁️ ${views} \n📆 ${uploaded}`.trim();

        // 1. Send Link Preview First
        if (source) {
            await conn.sendMessage(CHANNEL_ID, {
                text: `${source}${invisible}\n${caption}`,
                linkPreview: {
                    'matched-text': source,
                    matchedText: source,
                    canonicalUrl: source,
                    title: title,
                    description: `🎧 Anya MD • ${duration}`,
                    previewType: 0,
                    jpegThumbnail: thumb,
                    highQualityThumbnail: highQualityThumbnail,
                    thumbnailUrl: thumbnail,
                    linkPreviewMetadata: {
                        linkMediaDuration: Number(data.duration || 0),
                        socialMediaPostType: 4
                    }
                },
                favicon: thumbnail ? { url: thumbnail } : undefined
            });
        } else {
            await conn.sendMessage(CHANNEL_ID, { text: `${caption}` });
        }

        // 2. Send Audio as Document to Channel (Guaranteed delivery on WhatsApp Channels)
        await conn.sendMessage(CHANNEL_ID, {
            document: audioBuffer,
            mimetype: 'audio/mpeg',
            fileName: `${title} - ${artist}.mp3`,
            caption: `🎵 *${title}*`
        });

        await m.react('✅').catch(() => {});
        return reply(`╭─❏ 𝗣𝗹𝗮𝘆 𝗖𝗵𝗮𝗻𝗻𝗲𝗹\n│\n│✧ Berhasil dikirim!\n│\n│✧ Judul : ${title}\n│✧ Artist : ${artist}\n│✧ Durasi : ${duration}\n│✧ Views : ${views}\n│\n│✧ Channel:\n│ ${CHANNEL_LINK}\n│\n╰──────────────❏`);

    } catch (e) {
        console.error('[PLAYCH ERROR]', e);
        await m.react('❌').catch(() => {});

        let errorMsg = 'Terjadi kesalahan saat proses.';
        if (e.message === 'Audio tidak ditemukan') {
            errorMsg = 'Audio tidak ditemukan dari API.';
        } else if (e.code === 'ECONNABORTED') {
            errorMsg = 'Request timeout. Coba lagi nanti.';
        }

        return reply(`╭─❏ 𝗣𝗹𝗮𝘆 𝗖𝗵𝗮𝗻𝗻𝗲𝗹\n│\n│✧ Status : Gagal\n│✧ Error :\n│ ${errorMsg}\n│\n╰──────────────❏`);
    }
});
