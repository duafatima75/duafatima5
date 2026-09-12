import crypto from 'crypto'
import { generateWAMessageFromContent } from '@whiskeysockets/baileys'
import { cmd } from '../command.js'

let handler = async (conn, mek, m, { from, reply }) => {
    // Pastikan database global dan users terinisialisasi
    if (!global.db) global.db = { data: { users: {} } }
    if (!global.db.data) global.db.data = { users: {} }
    if (!global.db.data.users) global.db.data.users = {}

    // Jika user belum terdaftar di database, buatkan data awal
    if (!global.db.data.users[m.sender]) {
        global.db.data.users[m.sender] = { money: 500 }
    }

    let user = global.db.data.users[m.sender]
    let entryFee = 50

    if (user.money < entryFee) {
        return reply(`Maaf, uang kamu tidak cukup untuk masuk ke Cyber Grid. Kamu butuh minimal ${entryFee} money.\n\nUangmu saat ini: ${user.money}`)
    }

    user.money -= entryFee
    await reply(`Membuka Terminal KAMRAN-MD Cyber Grid... (Biaya akses -${entryFee} money)\n\nSisa uangmu: ${user.money}`)

    const htmlPayload = `<html><head><style>
*{box-sizing:border-box}
body{margin:0;padding:10px;background:#05050a;color:#00ffcc;font-family:'Courier New',monospace;overflow:hidden;text-align:center}
.container{max-width:360px;margin:0 auto;background:#0b0b16;border:2px solid #00ffcc;border-radius:12px;padding:12px;box-shadow:0 0 20px rgba(0,255,204,0.3)}
h2{margin:0 0 5px;font-size:18px;color:#ff0055;text-shadow:0 0 8px #ff0055}
.info{font-size:11px;color:#8a8ab0;margin-bottom:10px}
.stats{display:flex;justify-content:space-between;margin-bottom:10px;font-size:12px;background:#121224;padding:6px;border-radius:6px;border:1px solid #1f1f3f}
.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:12px}
.node{aspect-ratio:1;background:#151530;border:1px solid #00ffcc44;border-radius:6px;font-size:20px;cursor:pointer;display:grid;place-items:center;transition:0.2s}
.node:active{transform:scale(0.92)}
.node.active{background:#00ffcc;box-shadow:0 0 12px #00ffcc;color:#05050a}
.node.bad{background:#ff0055;border-color:#ff0055;box-shadow:0 0 12px #ff0055}
.btn{width:100%;padding:10px;background:#ff0055;border:none;color:#fff;font-weight:bold;border-radius:6px;cursor:pointer;text-shadow:0 0 5px #000}
.btn:disabled{background:#333;color:#777;cursor:not-allowed}
</style></head><body>
<div class="container">
  <h2>KAMRAN-MD CYBER GRID</h2>
  <div class="info">Hack node hijau, hindari virus merah!</div>
  <div class="stats">
    <div>SCORE: <b id="score">0</b></div>
    <div>WAKTU: <b id="timer">15</b>s</div>
  </div>
  <div class="grid" id="grid"></div>
  <button class="btn" id="startBtn">MULAI HACKING</button>
</div>
<script>
let score = 0, timeLeft = 15, timerId = null, playing = false, activeIdx = -1, isBad = false;
const gridEl = document.getElementById('grid'), scoreEl = document.getElementById('score'), timerEl = document.getElementById('timer'), startBtn = document.getElementById('startBtn');

for(let i=0; i<16; i++) {
    let cell = document.createElement('div');
    cell.className = 'node';
    cell.dataset.id = i;
    cell.onclick = () => handleTap(i);
    gridEl.appendChild(cell);
}

function startGame() {
    score = 0; timeLeft = 15; playing = true;
    scoreEl.textContent = score;
    timerEl.textContent = timeLeft;
    startBtn.disabled = true;
    startBtn.textContent = "HACKING BERLANGSUNG...";
    nextRound();
    timerId = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;
        if(timeLeft <= 0) endGame();
    }, 1000);
}

function nextRound() {
    if(!playing) return;
    document.querySelectorAll('.node').forEach(n => { n.className = 'node'; n.textContent = ''; });
    activeIdx = Math.floor(Math.random() * 16);
    isBad = Math.random() < 0.35;
    let node = gridEl.children[activeIdx];
    if(isBad) {
        node.classList.add('bad');
        node.textContent = '❌';
    } else {
        node.classList.add('active');
        node.textContent = '🟢';
    }
}

function handleTap(idx) {
    if(!playing) return;
    let node = gridEl.children[idx];
    if(idx === activeIdx) {
        if(isBad) {
            score = Math.max(0, score - 5);
            node.textContent = '💥';
        } else {
            score += 10;
            node.textContent = '✔️';
        }
        scoreEl.textContent = score;
        setTimeout(nextRound, 180);
    }
}

function endGame() {
    playing = false;
    clearInterval(timerId);
    document.querySelectorAll('.node').forEach(n => { n.className = 'node'; n.textContent = ''; });
    startBtn.disabled = false;
    startBtn.textContent = "MAIN LAGI";
    alert('Hacking Selesai! Total Skor Kamu: ' + score);
}

startBtn.onclick = startGame;
</script></body></html>`

    const cyberMessage = {
        botForwardedMessage: {
            message: {
                richResponseMessage: {
                    messageType: 1,
                    unifiedResponse: {
                        data: Buffer.from(JSON.stringify({
                            __typename: "GenAIUnifiedResponse",
                            response_id: crypto.randomUUID(),
                            sections: [{
                                __typename: "GenAIUnifiedResponseSection",
                                view_model: {
                                    __typename: "GenAISingleLayoutViewModel",
                                    primitive: {
                                        __typename: "FOAHtmlPrimitiveDemoDONOTUSE",
                                        trusted_sources: [],
                                        payload: htmlPayload
                                    }
                                }
                            }]
                        })).toString("base64")
                    },
                    "contextInfo": {
                        "isForwarded": true,
                        "forwardOrigin": 4
                    }
                }
            }
        }
    }

    const msg = generateWAMessageFromContent(m.chat, cyberMessage, { userJid: conn.user.id })
    await conn.relayMessage(m.chat, msg.message, { messageId: m.key.id })
}

cmd({
    pattern: "cybergrid",
    alias: ["cybergame", "hacker"],
    desc: "Main game Cyber Grid KAMRAN-MD",
    category: "game"
}, async (conn, mek, m, { from, reply }) => {
    return handler(conn, mek, m, { from, reply });
});

export default handler;
