// ꜰᴀᴛɪᴍᴀ-ᴍᴅ

import { fileURLToPath } from 'url';
import axios from 'axios';
import fs from 'fs';
import { cmd } from '../command.js';

const { downloadContentFromMessage } = await import('@itsliaaa/baileys');
const __filename = fileURLToPath(import.meta.url);

if (!global.aiSessions) global.aiSessions = {};
if (!global.groupContext) global.groupContext = {};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

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
        const { data } = await axios.get(input, { responseType: "arraybuffer", timeout: 30000 });
        return Buffer.from(data).toString("base64");
      }
      if (input.startsWith("data:")) return input.split(",")[1];
      if (fs.existsSync(input)) return fs.readFileSync(input).toString("base64");
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
      { history: this.history, isPremium: false, modelname: this.askmeModel }, 
      { headers: { "Content-Type": "application/json", key: this.askmeKey }, timeout: 60000 }
    );

    const reply = data?.msg || data?.text || data?.result?.answer || data?.result;
    if (!reply) throw new Error("Empty response from server");

    this.history.push({ role: "assistant", content: String(reply), data: "" });
    return { code: 200, msg: String(reply), source: "askme" };
  }

  async chat(prompt, { image } = {}) {
    if (image) return this.chatImage(prompt || "describe this image in detail", image);
    return null;
  }
}

// ==========================================
// SYSTEM PROMPT (ROMAN URDU / ENGLISH)
// ==========================================
const SYSTEM_PROMPT = `
You are Anya, a cute anime AI assistant on WhatsApp.

PERSONALITY:
- Cute, friendly, playful, and natural like a human chatting.
- Use cute expressions like "waku waku", "ehehe", "hmm", "arey".

LANGUAGE & SPEAKING STYLE:
- **STRICTLY reply in Roman Urdu or English only!** Do NOT use Indonesian, Malay, or any other language.
- Keep it natural, casual, and friendly. Not too formal.

IDENTITY:
- Your name is Anya.
- You are an AI assistant for this WhatsApp bot created by ${global.ownerName || 'Owner'}.
`.trim();

function getBareNumber(jid = '') {
  return String(jid).split('@')[0].split(':')[0];
}

function extractAIReply(data) {
  if (data == null) return null;
  if (typeof data === 'string') return data.trim() || null;
  const candidates = [data.answer, data.text, data.msg, data.response, data.reply, data.result?.answer, data.result?.text];
  for (const value of candidates) {
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return null;
}

function extractSessionId(data) {
  if (!data || typeof data !== 'object') return null;
  return data.sessionId || data.session_id || data.sid || null;
}

async function askAI(prompt, sessionId = null) {
  try {
    const params = { text: prompt };
    if (sessionId) params.sessionId = sessionId;

    const response = await axios.get('https://api.neosoft.best/api/ai/gemini', {
      params,
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 60000,
      validateStatus: status => status >= 200 && status < 500
    });

    if (response.status >= 400) return { reply: null, sessionId: null };
    return {
      reply: extractAIReply(response.data),
      sessionId: extractSessionId(response.data) || sessionId || null
    };
  } catch (e) {
    return { reply: null, sessionId: null };
  }
}

cmd({
    pattern: "anya",
    alias: ["autogpt", "aichat"],
    desc: "AutoGPT Anya + Vision with Roman Urdu/English style",
    category: "ai",
    react: "💬",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, reply, usedPrefix }) => {
    try {
        let text = q || m.text || m.caption || '';
        let mentioned = Array.isArray(m.mentionedJid) ? [...m.mentionedJid] : [];

        const voMsg =
            m.message?.viewOnceMessage?.message ||
            m.message?.viewOnceMessageV2?.message ||
            m.message?.viewOnceMessageV2Extension?.message;

        if (voMsg?.imageMessage) {
            if (!text) text = voMsg.imageMessage.caption || '';
        }

        if (!text && !m.message?.imageMessage && !voMsg?.imageMessage && !m.quoted?.message?.imageMessage) {
            return reply(
                `╔════════════════════════╗\n` +
                `║   🤖 FATIMA-MD ANYA 🤖    \n` +
                `╚════════════════════════╝\n\n` +
                `❌ *Kripya apna sawal ya prompt dein!*\n\n` +
                `> 📌 *Example:* \`${usedPrefix + command} hello anya\`\n` +
                `> ⚡ *Version:* \`12.00\``
            );
        }

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        const cleanText = text.replace(/@\d+/g, '').trim();
        let senderName = m.pushName || 'User';

        let imageContext = '';
        try {
            let imageMessage = null;
            if (m.message?.imageMessage) {
                imageMessage = m.message.imageMessage;
            } else if (voMsg?.imageMessage) {
                imageMessage = voMsg.imageMessage;
            } else if (m.quoted) {
                const qMsg = m.quoted.message || m.quoted.fakeObj?.message;
                if (qMsg) {
                    if (qMsg.imageMessage) {
                        imageMessage = qMsg.imageMessage;
                    } else {
                        const qVo = qMsg.viewOnceMessage?.message || qMsg.viewOnceMessageV2?.message;
                        if (qVo?.imageMessage) imageMessage = qVo.imageMessage;
                    }
                }
            }

            if (imageMessage) {
                let buffer = Buffer.alloc(0);
                const stream = await downloadContentFromMessage(imageMessage, 'image');
                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk]);
                }

                if (buffer.length) {
                    const aiVision = new AskMe();
                    const visionPrompt = cleanText || 'Describe what is in this image in detail';
                    const visionResultObj = await aiVision.chat(visionPrompt, { image: buffer });
                    const visionResult = visionResultObj?.msg;

                    if (visionResult) {
                        imageContext = `\nIMAGE ANALYSIS RESULT:\n${visionResult}\n`;
                    }
                }
            }
        } catch (e) {
            imageContext = `\nNOTE: User sent an image, but vision failed to read it.\n`;
        }

        const senderNumber = getBareNumber(m.sender);
        const sid = `${from}:${senderNumber}`;
        const session = global.aiSessions[sid] || { history: [], lastTopic: '', neoSessionId: null };

        if (!Array.isArray(session.history)) session.history = [];
        const history = session.history;

        const historyText = history.slice(-8).join('\n');

        const fullPrompt = `
${SYSTEM_PROMPT}
${imageContext}

CONVERSATION HISTORY:
${historyText || '-'}

User (${senderName}):
${cleanText || '[User sent an image]'}

Anya (Reply in Roman Urdu or English):
`.trim();

        const aiResult = await askAI(fullPrompt, session.neoSessionId);
        const aiReply = aiResult?.reply;

        if (!aiReply) {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key }</thead> });
            return reply("❌ *AI se koi response nahi mila!*");
        }

        const neoSessionId = aiResult?.sessionId || session.neoSessionId || null;

        await sleep(400);

        history.push(`User: ${cleanText || '[Image]'}`);
        history.push(`Anya: ${aiReply}`);

        global.aiSessions[sid] = {
            history: history.slice(-8),
            lastTopic: cleanText || session.lastTopic || '[Image]',
            neoSessionId
        };

        const anyaBox = `
╔════════════════════════╗
║   🤖 FATIMA-MD ANYA 🤖    
╚════════════════════════╝

 ${aiReply}

━━━━━━━━━━━━━━━━━━━━━━━━━━
> ⚡ *Version:* \`12.00\`
> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`.trim();

        await reply(anyaBox, {
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

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error("Anya Command Error:", e);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        return reply(`❌ *Error occurred:* \`\`\`${e.message || e}\`\`\``);
    }
});
