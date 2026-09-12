/*
📌 Nama Fitur : Autoai api x scrape support image 
🏷️ Type       : Plugin ESM
🤖 Chat AI    : FATIMA-MD Gemini / AskMe Vision
🔄 Session    : FATIMA-MD sessionId
*/

import axios from 'axios'
import fs from 'fs'
import { randomUUID } from 'crypto'
import { cmd } from '../command.js'

const { downloadContentFromMessage } = await import('@itsliaaa/baileys')

// ==========================================
// GLOBAL STORAGE
// ==========================================

if (!global.aiSessions) global.aiSessions = {}
if (!global.groupContext) global.groupContext = {}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

// ==========================================
// CLASS ASKME UNTUK DETEKSI GAMBAR
// ==========================================

class AskMe {
  constructor() {
    this.askmeUrl = "https://askme.matlubapps.com/ask-me";
    this.askmeKey = "ak8asda9$5kpq";
    this.askmeModel = "gpt_4__1_nano";
    this.history = [];
  }

  // ==========================================
  // RESOLVE MEDIA
  // ==========================================
  async resolveMedia(input) {
    if (!input) return "";
    if (Buffer.isBuffer(input)) return input.toString("base64");
    
    if (typeof input === "string") {
      // URL
      if (input.startsWith("http://") || input.startsWith("https://")) {
        const { data } = await axios.get(input, { 
          responseType: "arraybuffer", 
          timeout: 30000 
        });
        return Buffer.from(data).toString("base64");
      }
      
      // Data URL
      if (input.startsWith("data:")) {
        return input.split(",")[1];
      }
      
      // File lokal
      if (fs.existsSync(input)) {
        return fs.readFileSync(input).toString("base64");
      }
      
      return input;
    }
    return "";
  }

  // ==========================================
  // CHAT IMAGE / VISION
  // ==========================================
  async chatImage(prompt, image) {
    const b64 = await this.resolveMedia(image);
    
    if (!b64) {
      throw new Error("Gambar gagal dikonversi ke base64");
    }

    this.history.push({ 
      role: "user", 
      content: prompt, 
      data: b64 
    });

    const { data } = await axios.post(
      this.askmeUrl, 
      {
        history: this.history,
        isPremium: false,
        modelname: this.askmeModel,
      }, 
      {
        headers: { 
          "Content-Type": "application/json", 
          key: this.askmeKey 
        },
        timeout: 60000,
      }
    );

    const reply = data?.msg || data?.text || data?.result?.answer || data?.result;
    
    if (!reply) {
      throw new Error("Empty response from server");
    }

    this.history.push({ 
      role: "assistant", 
      content: String(reply), 
      data: "" 
    });
    
    return { 
      code: 200, 
      msg: String(reply), 
      source: "askme" 
    };
  }

  // ==========================================
  // CHAT
  // ==========================================
  async chat(prompt, { image } = {}) {
    if (image) {
      return this.chatImage(prompt || "deskripsikan gambar ini secara detail", image);
    }
    return null;
  }

  clearHistory() {
    this.history = [];
  }
}

// ==========================================
// SYSTEM PROMPT FATIMA-MD AI
// ==========================================

const SYSTEM_PROMPT = `
Kamu adalah FATIMA-MD, AI asisten pintar di bot WhatsApp.

KEPRIBADIAN:
- Ramah
- Pintar
- Santai
- Natural seperti manusia chatting
- Membantu dan responsif

GAYA BICARA:
- Pakai bahasa Indonesia santai
- Jangan terlalu formal
- Jangan terlalu panjang
- Jangan kaku

IDENTITAS:
- Namamu FATIMA-MD
- Kamu adalah AI utama dari bot WhatsApp FATIMA-MD
- Dibuat dan dikembangkan oleh ${global.ownerName || 'Owner'}

ATURAN INTERAKSI:
- Jangan mengaku ChatGPT atau Gemini secara langsung
- Tetap sopan dan interaktif
- Jangan toxic
`.trim()

// ==========================================
// GET BARE NUMBER
// ==========================================

function getBareNumber(jid = '') {
  return String(jid).split('@')[0].split(':')[0]
}

// ==========================================
// EXTRACT RESPONSE TEXT
// ==========================================

function extractAIReply(data) {
  if (data == null) {
    return null
  }

  if (typeof data === 'string') {
    const result = data.trim()
    return result || null
  }

  const candidates = [
    data.answer,
    data.text,
    data.msg,
    data.response,
    data.reply,
    data.result?.answer,
    data.result?.text,
    data.result?.msg,
    data.result?.response,
    data.result?.reply,
    data.data?.answer,
    data.data?.text,
    data.data?.msg,
    data.data?.response,
    data.data?.reply,
    typeof data.result === 'string' ? data.result : null,
    typeof data.data === 'string' ? data.data : null
  ]

  for (const value of candidates) {
    if (typeof value === 'string' && value.trim()) {
      return value.trim()
    }
  }

  return null
}

// ==========================================
// EXTRACT SESSION ID
// ==========================================

function extractSessionId(data) {
  if (!data) return null
  if (typeof data !== 'object') return null

  return (
    data.sessionId ||
    data.session_id ||
    data.sid ||
    data.result?.sessionId ||
    data.result?.session_id ||
    data.result?.sid ||
    data.data?.sessionId ||
    data.data?.session_id ||
    data.data?.sid ||
    null
  )
}

// ==========================================
// ASK AI API
// ==========================================

async function askAI(prompt, sessionId = null) {
  try {
    const params = {
      text: prompt
    }

    if (sessionId) {
      params.sessionId = sessionId
    }

    const response = await axios.get(
      'https://api.neosoft.best/api/ai/gemini',
      {
        params,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 Chrome/151.0.0.0 Mobile Safari/537.36',
          Accept: 'application/json, text/plain, */*'
        },
        timeout: 60000,
        validateStatus: status => status >= 200 && status < 500
      }
    )

    const data = response.data

    console.log('[FATIMA-MD AI STATUS]', response.status)

    if (response.status >= 400) {
      console.log('[FATIMA-MD HTTP ERROR]', response.status)
      return { reply: null, sessionId: null }
    }

    const reply = extractAIReply(data)
    const newSessionId = extractSessionId(data)

    if (!reply) {
      console.log('[FATIMA-MD] Jawaban tidak ditemukan')
      return {
        reply: null,
        sessionId: newSessionId || sessionId || null
      }
    }

    return {
      reply,
      sessionId: newSessionId || sessionId || null
    }

  } catch (e) {
    console.log('[FATIMA-MD AI ERROR]', e?.response?.data || e?.message || e)
    return {
      reply: null,
      sessionId: null
    }
  }
}

// ==========================================
// BEFORE HANDLER (Auto Response / Chat Handler)
// ==========================================

export async function before(m, { conn }) {
  try {
    let text =
      m.text ||
      m.caption ||
      m.message?.conversation ||
      m.message?.extendedTextMessage?.text ||
      ''

    let mentioned = Array.isArray(m.mentionedJid) ? [...m.mentionedJid] : []

    const voMsg =
      m.message?.viewOnceMessage?.message ||
      m.message?.viewOnceMessageV2?.message ||
      m.message?.viewOnceMessageV2Extension?.message

    if (voMsg?.imageMessage) {
      if (!text) {
        text = voMsg.imageMessage.caption || ''
      }
      const voMentions = voMsg.imageMessage.contextInfo?.mentionedJid || []
      voMentions.forEach(jid => {
        if (!mentioned.includes(jid)) {
          mentioned.push(jid)
        }
      })
    }

    if (!text && !m.message?.imageMessage && !voMsg?.imageMessage && !m.quoted?.message?.imageMessage) return true
    if (m.fromMe) return true

    if (
      /^[./#!]/.test(text) ||
      m.message?.buttonsResponseMessage ||
      m.message?.templateButtonReplyMessage ||
      m.message?.listResponseMessage
    ) {
      return true
    }

    if (!global.db) return true
    if (!global.db.data) global.db.data = {}
    if (!global.db.data.chats) global.db.data.chats = {}
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}

    const chat = global.db.data.chats[m.chat]

    if (!chat.autogpt || chat.isBanned) {
      return true
    }

    const botJid = conn.user?.jid || conn.user?.id
    if (!botJid) return true

    const botNumber = getBareNumber(botJid)

    const isMention = mentioned.some(jid => getBareNumber(jid) === botNumber)
    const isReplyBot = m.quoted && getBareNumber(m.quoted.sender) === botNumber

    if (!isMention && !isReplyBot) {
      return true
    }

    const cleanText = text.replace(/@\d+/g, '').trim()

    let senderName = m.pushName || ''
    if (!senderName) {
      try {
        senderName = await conn.getName(m.sender)
      } catch {
        senderName = 'User'
      }
    }
    if (!senderName) senderName = 'User'

    let imageContext = ''
    try {
      let imageMessage = null

      if (m.message?.imageMessage) {
        imageMessage = m.message.imageMessage
      } else if (voMsg?.imageMessage) {
        imageMessage = voMsg.imageMessage
      } else if (m.quoted) {
        const qMsg = m.quoted.message || m.quoted.fakeObj?.message
        if (qMsg) {
          if (qMsg.imageMessage) {
            imageMessage = qMsg.imageMessage
          } else {
            const qVo =
              qMsg.viewOnceMessage?.message ||
              qMsg.viewOnceMessageV2?.message ||
              qMsg.viewOnceMessageV2Extension?.message
            if (qVo?.imageMessage) imageMessage = qVo.imageMessage
          }
        }
      }

      if (imageMessage) {
        console.log('[FATIMA-MD VISION] Gambar ditemukan')
        let buffer = Buffer.alloc(0)

        const stream = await downloadContentFromMessage(imageMessage, 'image')
        for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk])
        }

        if (!buffer.length) throw new Error('Buffer gambar kosong')

        const aiVision = new AskMe()
        const visionPrompt = cleanText || 'Tolong jelaskan secara detail gambar apa ini?'

        const visionResultObj = await aiVision.chat(visionPrompt, { image: buffer })
        const visionResult = visionResultObj?.msg

        if (visionResult) {
          imageContext = `\nHASIL ANALISIS GAMBAR:\n${visionResult}\n`
        }
      }
    } catch (e) {
      console.log('[FATIMA-MD VISION ERROR]', e?.response?.data || e?.message || e)
      imageContext = `\nCATATAN VISION:\nUser mengirim gambar, tetapi sistem gagal memprosesnya.\n`
    }

    if (!global.groupContext[m.chat]) global.groupContext[m.chat] = []

    global.groupContext[m.chat].push({
      sender: senderName,
      text: cleanText || '[Mengirim gambar]'
    })

    global.groupContext[m.chat] = global.groupContext[m.chat].slice(-15)

    const senderNumber = getBareNumber(m.sender)
    const ownerNumber = getBareNumber(global.ownerNumber || '')
    const isOwnerReal = senderNumber === ownerNumber

    const sid = `${m.chat}:${senderNumber}`
    const session = global.aiSessions[sid] || {
      history: [],
      lastTopic: '',
      neoSessionId: null
    }

    if (!Array.isArray(session.history)) session.history = []
    const history = session.history

    const ownerName = global.ownerName || 'Owner'
    const ownerContext = isOwnerReal
      ? `\nSTATUS USER:\n- User ini adalah ${ownerName} (Owner FATIMA-MD).\n`
      : `\nSTATUS USER:\n- User ini adalah pengguna biasa.\n`

    const recentContext = (global.groupContext[m.chat] || [])
      .map(v => `${v.sender}: ${v.text}`)
      .join('\n')

    let replyInfo = ''
    if (m.quoted) {
      let quotedName = m.quoted.sender
      try {
        quotedName = await conn.getName(m.quoted.sender) || m.quoted.sender
      } catch {}
      const quotedText = m.quoted.text || m.quoted.caption || '[Pesan media]'
      replyInfo = `\nPESAN YANG DIREPLY:\n${quotedName}: ${quotedText}\n`
    }

    const historyText = history.slice(-8).join('\n')

    const fullPrompt = `
${SYSTEM_PROMPT}
${ownerContext}

TOPIK SEBELUMNYA:
${session.lastTopic || '-'}

KONTEKS GRUP:
${recentContext || '-'}
${replyInfo}
${imageContext}

RIWAYAT PERCAKAPAN:
${historyText || '-'}

User (${senderName}):
${cleanText || '[User mengirim gambar]'}

FATIMA-MD:
`.trim()

    try {
      await conn.sendPresenceUpdate('composing', m.chat)
    } catch {}

    const aiResult = await askAI(fullPrompt, session.neoSessionId)
    const reply = aiResult?.reply

    if (!reply) return true

    const neoSessionId = aiResult?.sessionId || session.neoSessionId || null

    await sleep(600)

    history.push(`User: ${cleanText || '[Mengirim gambar]'}`)
    history.push(`FATIMA-MD: ${reply}`)

    global.aiSessions[sid] = {
      history: history.slice(-8),
      lastTopic: cleanText || session.lastTopic || '[Gambar]',
      neoSessionId
    }

    await conn.sendMessage(m.chat, { text: reply }, { quoted: m })

  } catch (e) {
    console.log('[FATIMA-MD AutoAI ERROR]', e?.stack || e?.message || e)
  }

  return true
}

// ==========================================
// COMMAND HANDLER (Opsional jika ingin dipanggil via command)
// ==========================================

cmd({
  pattern: "autoai",
  alias: ["aiimage", "vision"],
  desc: "Auto AI Gemini & Vision Support",
  category: "ai",
}, async (conn, mek, m, { q, reply }) => {
  if (!q && !m.quoted) return reply("Ketik pertanyaan atau reply gambar dengan caption .autoai");
  
  try {
    await conn.sendPresenceUpdate('composing', m.chat);
    let prompt = q || "Jelaskan gambar ini";
    let imageBuffer = null;

    if (m.quoted && m.quoted.message?.imageMessage) {
      const stream = await downloadContentFromMessage(m.quoted.message.imageMessage, 'image');
      let buffer = Buffer.alloc(0);
      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
      }
      imageBuffer = buffer;
    }

    if (imageBuffer) {
      const aiVision = new AskMe();
      const visionResultObj = await aiVision.chat(prompt, { image: imageBuffer });
      return reply(visionResultObj?.msg || "Gagal memproses gambar.");
    } else {
      const res = await askAI(prompt);
      if (!res.reply) return reply("Gagal mendapatkan respons dari AI.");
      return reply(res.reply);
    }
  } catch (e) {
    return reply(`Terjadi kesalahan: ${e.message}`);
  }
});
