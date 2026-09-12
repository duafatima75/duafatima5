import { fileURLToPath } from 'url';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

const htmlPayload = `<style>
* { -webkit-tap-highlight-color: transparent; -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; box-sizing: border-box; }
body { margin: 0; background: transparent; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #eee; touch-action: manipulation; cursor: pointer; }
.mp-wrap { width: 100%; max-width: 640px; margin: auto; padding: 12px; }
.mp-card { background: rgba(15, 18, 28, 0.95); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(168, 85, 247, 0.4); border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(168, 85, 247, 0.2); }
.mp-header { padding: 14px 18px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); display: flex; justify-content: space-between; align-items: center; background: linear-gradient(90deg, rgba(168,85,247,0.08), rgba(236,72,153,0.08)); }
.mp-sub { font-size: 10px; letter-spacing: 2px; color: #a855f7; font-weight: 700; text-transform: uppercase; }
.mp-title { font-size: 18px; font-weight: 900; color: #fff; text-shadow: 0 0 10px rgba(168, 85, 247, 0.6); }
.mp-body { padding: 14px; display: flex; flex-direction: column; gap: 10px; }
.search-box { display: flex; gap: 8px; }
.search-input { flex: 1; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 8px; padding: 8px 12px; color: #fff; font-size: 13px; outline: none; }
.search-input::placeholder { color: rgba(255,255,255,0.4); }
.search-btn { background: #a855f7; border: none; border-radius: 8px; color: #fff; padding: 0 14px; font-weight: 700; cursor: pointer; }
.player-screen { width: 100%; background: #080b12; border: 1px solid rgba(168, 85, 247, 0.25); border-radius: 12px; padding: 14px; display: flex; flex-direction: column; align-items: center; }
.vinyl-disc { width: 110px; height: 110px; border-radius: 50%; background: radial-gradient(circle, #1e293b 25%, #0f172a 26%, #020617 70%); border: 3px solid #334155; display: flex; align-items: center; justify-content: center; margin-bottom: 10px; transition: transform 0.3s linear; }
.vinyl-disc.spin { animation: spin 2.5s linear infinite; }
.vinyl-center { width: 35px; height: 35px; border-radius: 50%; background: #ec4899; border: 2px solid #fff; display: flex; align-items: center; justify-content: center; font-size: 8px; font-weight: 900; color: #fff; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
.track-name { font-size: 15px; font-weight: 800; color: #fff; margin-bottom: 2px; text-align: center; }
.track-artist { font-size: 10px; color: rgba(255,255,255,0.5); font-weight: 600; margin-bottom: 10px; text-align: center; }
.progress-bar-wrap { width: 100%; height: 5px; background: rgba(255,255,255,0.1); border-radius: 3px; margin-bottom: 12px; overflow: hidden; }
.progress-bar-fill { width: 0%; height: 100%; background: linear-gradient(90deg, #a855f7, #ec4899); }
.player-actions { display: flex; align-items: center; gap: 14px; }
.action-btn { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 50%; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #fff; }
.action-btn.play-main { background: #a855f7; border-color: #a855f7; box-shadow: 0 0 12px rgba(168, 85, 247, 0.6); }
.action-btn:active { transform: scale(0.92); }
.svg-icon { display: inline-block; vertical-align: middle; }
</style>

<div class="mp-wrap">
  <div class="mp-card">
    <div class="mp-header">
      <div>
        <div class="mp-sub">FATIMA-MD MEDIA</div>
        <div class="mp-title">Search & Live Player</div>
      </div>
    </div>
    <div class="mp-body">
      <div class="search-box">
        <input type="text" id="searchInput" class="search-input" placeholder="Search song (e.g. Atif Aslam, Lo-Fi)...">
        <button class="search-btn" onclick="searchSong()">Search</button>
      </div>
      <div class="player-screen">
        <div id="vinyl" class="vinyl-disc">
          <div class="vinyl-center">PLAY</div>
        </div>
        <div id="trackName" class="track-name">Cyber Synthwave Beat</div>
        <div id="trackArtist" class="track-artist">FATIMA-MD Studio</div>
        <div class="progress-bar-wrap">
          <div id="progressBar" class="progress-bar-fill"></div>
        </div>
        <div class="player-actions">
          <button class="action-btn" onclick="prevSong()">⏮</button>
          <button class="action-btn play-main" onclick="togglePlay()">
            <span id="playStateText" style="font-size:16px; font-weight:900;">▶</span>
          </button>
          <button class="action-btn" onclick="nextSong()">⏭</button>
        </div>
      </div>
      <div style="font-size: 9px; color: rgba(168, 85, 247, 0.5); text-align: center; font-weight: 600; letter-spacing: 1px;">WM: FATIMA-MD</div>
    </div>
  </div>
</div>

<script>
let audioCtx = null;
let isPlaying = false;
let timer = null;
let progress = 0;
let currentSongIndex = 0;

const songs = [
  { title: "Cyber Synthwave Beat", artist: "FATIMA-MD Studio", freq: 440 },
  { title: "Night Runner Lo-Fi", artist: "Neon Vibes", freq: 523 },
  { title: "Electric Chill Ambient", artist: "Cyber Dreams", freq: 659 },
  { title: "Future Bass Track", artist: "Remix Lab", freq: 784 }
];

function initAudio() {
  if (!audioCtx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) audioCtx = new AudioCtx();
  }
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
}

function togglePlay() {
  initAudio();
  isPlaying = !isPlaying;
  let vinyl = document.getElementById('vinyl');
  let playText = document.getElementById('playStateText');

  if (isPlaying) {
    vinyl.className = 'vinyl-disc spin';
    playText.textContent = '❚❚';
    startLoop();
  } else {
    vinyl.className = 'vinyl-disc';
    playText.textContent = '▶';
    clearInterval(timer);
  }
}

function startLoop() {
  clearInterval(timer);
  timer = setInterval(() => {
    progress += 0.8;
    if (progress >= 100) {
      progress = 0;
      nextSong();
      return;
    }
    document.getElementById('progressBar').style.width = progress + '%';
  }, 200);

  playTone();
}

function playTone() {
  try {
    if (audioCtx) {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(songs[currentSongIndex].freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    }
  } catch(e) {}
}

function nextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  updateSongDisplay();
  progress = 0;
  if (isPlaying) startLoop();
}

function prevSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  updateSongDisplay();
  progress = 0;
  if (isPlaying) startLoop();
}

function updateSongDisplay() {
  let s = songs[currentSongIndex];
  document.getElementById('trackName').textContent = s.title;
  document.getElementById('trackArtist').textContent = s.artist;
  document.getElementById('progressBar').style.width = '0%';
}

function searchSong() {
  let query = document.getElementById('searchInput').value.trim();
  if (!query) return;
  // Custom search simulation
  songs.unshift({
    title: query,
    artist: "Searched Track (Live)",
    freq: Math.floor(Math.random() * 400) + 300
  });
  currentSongIndex = 0;
  updateSongDisplay();
  progress = 0;
  if (!isPlaying) togglePlay();
  else startLoop();
}
</script>`;

const SIG = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LVZlcmlmaWNhdGlvblNpZ25hdHVyZS5NZXRhZGF0YeN55YRyad2+ZA==";
const CERT1 = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGEOvtJr968bbpKdZreOTwkk9aPN++XPE60RfuzNLkXXc7LE8BOkJOWRpo2oNXaRJ3uCNJ43HY3A+oetnvHSfcxWqmvvTSrBOI5V1NOD6RMsZ/st1XVPUx83AGps1l5jYBOYzqMNy6un2tToJ2Bt9bXRo29tWLZTu8m7TNY/hISwVpVc5tjSet5U7btPN+dMIx2UvykB1jcbWGsdklheeuz8RXSStNXzeaGvsf1lpZ/ugLE4b2BdmlRNKrY6zLE4qFtRYQoS7axOyQX+4QUyN2m9bfm7urQmn+QRSXJwMO7X5kAJJLbkVGJFt9Pm9VXPwQVrK2aaqiXlpusj+7DfDw00OULmYMmZDTqXM0nUVLxj13z0LhMQoQhhNG8utdUn4uKOFceliTZ/xiP+A54GnX9620641bqw3ctfh9NNXPsTEK8hAUD7FDqUhVntHmoEYYEHq8X1tHHZYP49/f2iezTiE8AUaoZo42/jIWQIKohOGNUib2hEqMkW8NsR8vPihvNuqPc0zKZcl6359YFQdjiiW8kCRD/rsDOr9v1eYLFZKYloFyzFqEgj+jcG/V47elOjShJ5CCPwatXwP6HIloVwtgygFsnOFmCg6Ojoivfoz8Nw1qxFwg5OU2cq/1WbWNELKnaFg4eUWCAIJ/3ZIJsEPkgemZxGhE+hdiNn9dkQYBJs1kx2BxdIkJmQ9vJSKkrMz6lTxZM3IJ9mhmKS6zYdU1ppeAao0/ayte997DQParb/AHLN79g0iW1ad0z8ir5jAl0q3a+UZPTSa4YiSqC2PZ/gfxG5wvL2mKmeKowG0RXjmEp5iNxrni+T/HRLZOoH7y0DQ24nMCPg";
const CERT2 = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGHsL0Ccm0ELINFZ2IaBhKaeWnVuh0o6nZLCioCn9xpSADzwIS5VCWO+1eVXT2atJOyf7FYlpB0/JA3Us+aQtekuIkHu/zBXijORZ4ClF4+sF3cSTNg6gY/+6iwLK/zs3bMg+GeJrcI65vXfs95Shxlb2Rd5GRT2/2yBmR6Zkf5QwMJuptUHWtM26WY7/xlkEKGFZVqOSylusiOzSALa815zC6dCiHoJNLBEKMlaZZQOk57/+OYoU5zzTaEgLhyvNFHSyAlyLQ3SGFtVHAaJZHSmmSPyJowCOB+92Gkk6SWVMsk6FbU8QJWFtlhzV/W/gZ7WzUlS/AKgN0th9/cq20ToFkW7X9c+rtYavufmuieqFhXgaMD8AGsoN9QC/HzNC9D1nydPfFYEUr9BHVy2nF5gM58Y59r2rT8p5LPARIkUp8g+5DLhyW0tdZFZ1305o4AHCayZnp5rjcU2Xi/c1Qf/djBGakmijlMs4aMzKJYD0c4Q8jdI7sNyd876K2wRD+L6KeD2QB3PtCS4P7BWAl5gh5CJ6ZBrwcaKXZqcSjEwm52MqVCgYZdapAaNYUy/QndttjLOG0wxxwuX1hIhMjPnIKZR1kwnqD5EqlHpilrnojRZvjVGN4zEKmilS8rNstt4HHs/D849W+Q6LRVWiWMs0cT2IugrX+Skxd8En7Gq52UEmuVBrSTpN+UpIu20NsVb9lsvuYh3XO441606tOEY2eKcZJdTtqrOTNqbbTk0zVn1yhbOCvmfctBNDhTwaC5QMi0P9wjU5XI9SBtkdQLizc5oqpoiHeqgb8+aJHVLcbgIJ/KLZKtRWFDfzRNM02Csx4etUUapVd2NA/L0oMs/O5T9sVj9FBJ7q99GWr3PVmxJb36mHZLXC4k1gGN9swE0LtzYsUdT5tUo9ri/hS3W/SM+F1p4Kh4QIgRcG3ciIHGN44bnDh3HDCz0fDnzKYw0bclMxZPctEyJ5gEOPF6OAkjD9dEaRGq/tEPf1k9Aub+v2dEjnfrYWAm4E5Zfhs2Xh0CT0k+SzhgKd0K/46ChJ20G5+blwpIvahvTVS68+aVIX6CwXs4tcVx6FnmVsMOOkIasfaqQLZYbNBkuLoZnQAq4j8yRekrQ==";

cmd({
    pattern: "searchmusic",
    alias: ["musicsearch", "mp3search"],
    desc: "Interactive Search & Live Music Player via FATIMA-MD Rich Message",
    category: "game",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.relayMessage(
            from,
            {
                messageContextInfo: {
                    deviceListMetadata: {},
                    deviceListMetadataVersion: 2,
                    botMetadata: {
                        messageDisclaimerText: "",
                        botResponseId: "h8i01826-099i-61j3-d37f-836ffc114226",
                        verificationMetadata: {
                            proofs: [
                                {
                                    version: 1,
                                    useCase: 1,
                                    signature: SIG,
                                    certificateChain: [CERT1, CERT2]
                                }
                            ]
                        }
                    }
                },
                botForwardedMessage: {
                    message: {
                        richResponseMessage: {
                            messageType: 1,
                            submessages: [
                                {
                                    messageType: 2,
                                    messageText: "FATIMA-MD Search & Music Player"
                                }
                            ],
                            unifiedResponse: {
                                data: Buffer.from(JSON.stringify({
                                    "response_id": "0jh13h8i-4959-740i-2h5f-4i2i7g70h905",
                                    "sections": [
                                        {
                                            "view_model": {
                                                "primitive": {
                                                    "__typename": "GenAIaeacdsnwHtmlPrimitive",
                                                    "payload": htmlPayload,
                                                    "trusted_sources": [
                                                        "fatimamv.dev"
                                                    ]
                                                },
                                                "__typename": "GenAISingleLayoutViewModel"
                                            }
                                        }
                                    ]
                                })).toString('base64')
                            },
                            contextInfo: {
                                forwardingScore: 1,
                                isForwarded: true,
                                forwardedAiBotMessageInfo: {
                                    botJid: "867051314767696@bot"
                                },
                                forwardOrigin: 4
                            }
                        }
                    }
                }
            },
            {}
        );
    } catch (e) {
        console.error('[SEARCH MUSIC ERROR]', e?.message || e);
        return await reply('❌ Gagal mengirim player: ' + (e?.message || e));
    }
});
