/*
📌 Nama Fitur : Autoai api x scrape support image 
🏷️ Type       : Plugin ESM
🤖 Chat AI    : FATIMA-MD Gemini / AskMe Vision
*/

import axios from 'axios'
import fs from 'fs'
import { randomUUID } from 'crypto'
import { cmd } from '../command.js'

const { downloadContentFromMessage } = await import('@itsliaaa/baileys')

if (!global.aiSessions) global.aiSessions = {}
if (!global.groupContext) global.groupContext = {}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

class AskMe {
  constructor() {
    this.askmeUrl = "https://askme.matlubapps.com/ask-me";
    this.askmeKey = "ak8asda9$5kpq";
    this.askmeModel = "gpt_4__1_nano";
    this.history = [];
  }

  async resolveMedia(input) {
    if (!input) return "";
    if (Buffer.isBuffer(input)) return input.toString("base64");
    
    if (typeof input === "string") {
      if (input.startsWith("http://") || input.startsWith("https://")) {
        const { data } = await axios.get(input, { 
          responseType: "arraybuffer", 
          timeout: 30000 
        });
        return Buffer.from(data).toString("base64");
      }
      if (input.startsWith("data:")) {
        return input.split(",")[1];
      }
      if (fs.existsSync(input)) {
        return fs.readFileSync(input).toString("base64");
      }
      return input;
    }
    return "";
  }

  async chatImage(prompt, image) {
    const b64 = await this.resolveMedia(image);
    if (!b64) throw new Error("Gambar gagal dikonversi ke base64");

    this.history.push({ role: "user", content: prompt, data: b64 });

    const { data } = await axios.post(
      this.askmeUrl, 
      {
        history: this.history,
        isPremium: false,
        modelname: this.askmeModel,
      }, 
      {
        headers: { "Content-Type": "application/json", key: this.askmeKey },
        timeout: 60000,
      }
    );

    const reply = data?.msg || data?.text || data?.result?.answer || data?.result;
    if (!reply) throw new Error("Empty response from server");

    this.history.push({ role: "assistant", content: String(reply), data: "" });
    return { code: 200, msg: String(reply), source: "askme" };
  }

  async chat(prompt, { image } = {}) {
    if (image) {
      return this.chatImage(prompt || "deskripsikan gambar ini secara detail", image);
    }
    return null;
  }
}

const SYSTEM_PROMPT = `
Kamu adalah FATIMA-MD, AI asisten pintar di bot WhatsApp yang ramah, santai, dan membantu.
`.trim()

function getBareNumber(jid = '') {
  return String(jid).split('@')[0].split(':')[0]
}

function extractAIReply(data) {
  if (data == null) return null
  if (typeof data === 'string') return data.trim() || null

  const candidates = [
    data.answer, data.text, data.msg, data.response, data.reply,
    data.result?.answer, data.result?.text, data.result?.msg, data.result?.response, data.result?.reply,
    data.data?.answer, data.data?.text, data.data?.msg, data.data?.response, data.data?.reply
  ]

  for (const value of candidates) {
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return null
}

function extractSessionId(data) {
  if (!data || typeof data !== 'object') return null
  return data.sessionId || data.session_id || data.sid || data.result?.sessionId || null
}

async function askAI(prompt, sessionId = null) {
  try {
    const params = { text: prompt }
    if (sessionId) params.sessionId = sessionId

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

    if (response.status >= 400) return { reply: null, sessionId: null }

    const reply = extractAIReply(response.data)
    const newSessionId = extractSessionId(response.data)

    return {
      reply: reply || "Maaf, sepertinya aku kurang paham atau server sedang sibuk. Bisa ulangi pertanyaannya?",
      sessionId: newSessionId || sessionId || null
    }
  } catch (e) {
    return { reply: null, sessionId: null }
  }
}

export async function before(m, { conn }) {
  try {
    let text = m.text || m.caption || m.message?.conversation || m.message?.extendedTextMessage?.text || ''
    let mentioned = Array.isArray(m.mentionedJid) ? [...m.mentionedJid] : []

    const voMsg = m.message?.viewOnceMessage?.message || m.message?.viewOnceMessageV2?.message
    if (voMsg?.imageMessage) {
      if (!text) text = voMsg.imageMessage.caption || ''
      voMsg.imageMessage.contextInfo?.mentionedJid?.forEach(jid => {
        if (!mentioned.includes(jid)) mentioned.push(jid)
      })
    }

    if (!text && !m.message?.imageMessage && !voMsg?.imageMessage && !m.quoted?.message?.imageMessage) return true
    if (m.fromMe) return true

    if (/^[./#!]/.test(text)) return true

    if (!global.db) return true
    if (!global.db.data) global.db.data = {}
    if (!global.db.data.chats) global.db.data.chats = {}
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}

    const chat = global.db.data.chats[m.chat]
    if (!chat.autogpt || chat.isBanned) return true

    const botJid = conn.user?.jid || conn.user?.id
    if (!botJid) return true
    const botNumber = getBareNumber(botJid)

    const isMention = mentioned.some(jid => getBareNumber(jid) === botNumber)
    const isReplyBot = m.quoted && getBareNumber(m.quoted.sender) === botNumber

    if (!isMention && !isReplyBot) return true

    const cleanText = text.replace(/@\d+/g, '').trim()

    // FIX: Agar pesan pendek seperti "all" atau "on" error/cut-off na de, usko proper prompt bana dein
    let finalPrompt = cleanText;
    if (cleanText.toLowerCase() === 'all' || cleanText.toLowerCase() === 'on') {
      finalPrompt = `Halo, tolong aktifkan atau jelaskan tentang mode ${cleanText}`;
    }

    let senderName = m.pushName || 'User'
    try { senderName = await conn.getName(m.sender) || 'User' } catch {}

    let imageContext = ''
    try {
      let imageMessage = null
      if (m.message?.imageMessage) imageMessage = m.message.imageMessage
      else if (voMsg?.imageMessage) imageMessage = voMsg.imageMessage
      else if (m.quoted) {
        const qMsg = m.quoted.message || m.quoted.fakeObj?.message
        if (qMsg?.imageMessage) imageMessage = qMsg.imageMessage
      }

      if (imageMessage) {
        let buffer = Buffer.alloc(0)
        const stream = await downloadContentFromMessage(imageMessage, 'image')
        for await (const chunk of stream) { buffer = Buffer.concat([buffer, chunk]) }

        if (buffer.length) {
          const aiVision = new AskMe()
          const visionResultObj = await aiVision.chat(finalPrompt || 'Jelaskan gambar ini', { image: buffer })
          if (visionResultObj?.msg) imageContext = `\nHASIL ANALISIS GAMBAR:\n${visionResultObj.msg}\n`
        }
      }
    } catch (e) {}

    const senderNumber = getBareNumber(m.sender)
    const sid = `${m.chat}:${senderNumber}`
    const session = global.aiSessions[sid] || { history: [], lastTopic: '', neoSessionId: null }
    if (!Array.isArray(session.history)) session.history = []

    const fullPrompt = `
${SYSTEM_PROMPT}
${imageContext}
User (${senderName}):
${finalPrompt || '[User mengirim gambar]'}

FATIMA-MD:
`.trim()

    try { await conn.sendPresenceUpdate('composing', m.chat) } catch {}

    const aiResult = await askAI(fullPrompt, session.neoSessionId)
    const reply = aiResult?.reply
    if (!reply) return true

    await sleep(400)
    session.history.push(`User: ${finalPrompt}`)
    session.history.push(`FATIMA-MD: ${reply}`)

    global.aiSessions[sid] = {
      history: session.history.slice(-8),
      lastTopic: finalPrompt || '[Gambar]',
      neoSessionId: aiResult?.sessionId || session.neoSessionId
    }

    await conn.sendMessage(m.chat, { text: reply }, { quoted: m })
  } catch (e) {
    console.log('[FATIMA-MD AutoAI ERROR]', e)
  }
  return true
}

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
      for await (const chunk of stream) { buffer = Buffer.concat([buffer, chunk]); }
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
