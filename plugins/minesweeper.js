import { fileURLToPath } from 'url';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

const htmlPayload = `<style>
* { -webkit-tap-highlight-color: transparent; -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; box-sizing: border-box; }
body { margin: 0; background: transparent; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #eee; touch-action: manipulation; cursor: pointer; }
.mp-wrap { width: 100%; max-width: 640px; margin: auto; padding: 12px; }
.mp-card { background: rgba(15, 18, 28, 0.9); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(239, 68, 68, 0.15), 0 0 15px rgba(59, 130, 246, 0.2); }
.mp-header { padding: 14px 18px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); display: flex; justify-content: space-between; align-items: center; background: linear-gradient(90deg, rgba(239,68,68,0.06), rgba(59,130,246,0.06)); }
.mp-sub { font-size: 10px; letter-spacing: 2px; color: #ef4444; font-weight: 700; text-transform: uppercase; display: flex; align-items: center; gap: 4px; }
.mp-title { font-size: 20px; font-weight: 900; color: #fff; text-shadow: 0 0 10px rgba(239, 68, 68, 0.6); letter-spacing: 1px; }
.mp-controls { display: flex; gap: 8px; }
.mp-btn { background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease; padding: 0; color: #fff; }
.mp-btn:active { transform: scale(0.9); }
.mp-body { padding: 16px; display: flex; flex-direction: column; align-items: center; position: relative; }
.player-screen { width: 100%; background: #080b12; border: 1px solid rgba(239, 68, 68, 0.25); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; align-items: center; box-shadow: inset 0 0 20px rgba(0,0,0,0.8); }
.vinyl-disc { width: 140px; height: 140px; border-radius: 50%; background: radial-gradient(circle, #1e293b 25%, #0f172a 26%, #020617 70%); border: 4px solid #334155; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px rgba(0,0,0,0.8); margin-bottom: 16px; transition: transform 0.3s linear; position: relative; }
.vinyl-disc.spin { animation: spin 4s linear infinite; }
.vinyl-center { width: 45px; height: 45px; border-radius: 50%; background: #ef4444; border: 2px solid #fff; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900; color: #fff; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
.track-info { text-align: center; margin-bottom: 14px; width: 100%; }
.track-name { font-size: 16px; font-weight: 800; color: #fff; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.track-artist { font-size: 11px; color: rgba(255,255,255,0.5); font-weight: 600; }
.progress-bar-wrap { width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; margin-bottom: 14px; overflow: hidden; cursor: pointer; position: relative; }
.progress-bar-fill { width: 0%; height: 100%; background: linear-gradient(90deg, #ef4444, #3b82f6); border-radius: 3px; transition: width 0.1s linear; }
.player-actions { display: flex; align-items: center; gap: 16px; margin-bottom: 8px; }
.action-btn { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 50%; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #fff; transition: all 0.2s; }
.action-btn.play-main { width: 56px; height: 56px; background: #ef4444; border-color: #ef4444; box-shadow: 0 0 15px rgba(239, 68, 68, 0.5); }
.action-btn:active { transform: scale(0.92); }
.svg-icon { display: inline-block; vertical-align: middle; }
</style>

<div class="mp-wrap">
  <div class="mp-card">
    <div class="mp-header">
      <div>
        <div class="mp-sub">
          <svg class="svg-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
          FATIMA-MD MEDIA
        </div>
        <div class="mp-title">Neon MP3 Hub</div>
      </div>
      <div class="mp-controls">
        <button class="mp-btn" title="Playlist" onclick="togglePlaylist()">
          <svg class="svg-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
        </button>
      </div>
    </div>
    <div class="mp-body">
      <div class="player-screen">
        <div id="vinyl" class="vinyl-disc">
          <div class="vinyl-center">MP3</div>
        </div>
        <div class="track-info">
          <div id="trackName" class="track-name">Cybernetic Dreams</div>
          <div id="trackArtist" class="track-artist">FATIMA-MD Synthwave</div>
        </div>
        <div class="progress-bar-wrap" onclick="seekTrack(event)">
          <div id="progressBar" class="progress-bar-fill"></div>
        </div>
        <div class="player-actions">
          <button class="action-btn" onclick="prevTrack()">
            <svg class="svg-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="4" x2="5" y2="20"></line></svg>
          </button>
          <button class="action-btn play-main" onclick="togglePlay()" id="playBtn">
            <svg id="playIcon" class="svg-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            <svg id="pauseIcon" class="svg-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:none"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
          </button>
          <button class="action-btn" onclick="nextTrack()">
            <svg class="svg-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="4" x2="19" y2="20"></line></svg>
          </button>
        </div>
      </div>
      <div style="font-size: 10px; color: rgba(239, 68, 68, 0.5); text-align: center; margin-top: 10px; font-weight: 600; letter-spacing: 1px;">WM: FATIMA-MD</div>
    </div>
  </div>
</div>

<script>
let audioCtx = null;
let isPlaying = false;
let currentTrackIdx = 0;
let progress = 0;
let animInterval = null;

const playlist = [
  { title: "Cybernetic Dreams", artist: "FATIMA-MD Synthwave", freq: 440 },
  { title: "Neon Horizon Beats", artist: "Retrowave Vibes", freq: 523 },
  { title: "Quantum Cyber Pulse", artist: "Electro Ambient", freq: 659 }
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
  let playIcon = document.getElementById('playIcon');
  let pauseIcon = document.getElementById('pauseIcon');

  if (isPlaying) {
    vinyl.className = 'vinyl-disc spin';
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'inline-block';
    startSynthLoop();
  } else {
    vinyl.className = 'vinyl-disc';
    playIcon.style.display = 'inline-block';
    pauseIcon.style.display = 'none';
    clearInterval(animInterval);
  }
}

function startSynthLoop() {
  clearInterval(animInterval);
  animInterval = setInterval(() => {
    progress += 0.5;
    if (progress >= 100) {
      progress = 0;
      nextTrack();
      return;
    }
    document.getElementById('progressBar').style.width = progress + '%';
  }, 200);

  // Play synthetic tone using Web Audio API to simulate active playback
  try {
    if (audioCtx) {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(playlist[currentTrackIdx].freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.5);
    }
  } catch(e) {}
}

function nextTrack() {
  currentTrackIdx = (currentTrackIdx + 1) % playlist.length;
  progress = 0;
  updateTrackInfo();
  if (isPlaying) startSynthLoop();
}

function prevTrack() {
  currentTrackIdx = (currentTrackIdx - 1 + playlist.length) % playlist.length;
  progress = 0;
  updateTrackInfo();
  if (isPlaying) startSynthLoop();
}

function updateTrackInfo() {
  let track = playlist[currentTrackIdx];
  document.getElementById('trackName').textContent = track.title;
  document.getElementById('trackArtist').textContent = track.artist;
  document.getElementById('progressBar').style.width = '0%';
}

function seekTrack(e) {
  let rect = e.currentTarget.getBoundingClientRect();
  let clickX = e.clientX - rect.left;
  progress = (clickX / rect.width) * 100;
  document.getElementById('progressBar').style.width = progress + '%';
}

function togglePlaylist() {
  nextTrack();
}
</script>`;

const SIG = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LVZlcmlmaWNhdGlvblNpZ25hdHVyZS5NZXRhZGF0YeN55YRyad2+ZA==";
const CERT1 = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGEOvtJr968bbpKdZreOTwkk9aPN++XPE60RfuzNLkXXc7LE8BOkJOWRpo2oNXaRJ3uCNJ43HY3A+oetnvHSfcxWqmvvTSrBOI5V1NOD6RMsZ/st1XVPUx83AGps1l5jYBOYzqMNy6un2tToJ2Bt9bXRo29tWLZTu8m7TNY/hISwVpVc5tjSet5U7btPN+dMIx2UvykB1jcbWGsdklheeuz8RXSStNXzeaGvsf1lpZ/ugLE4b2BdmlRNKrY6zLE4qFtRYQoS7axOyQX+4QUyN2m9bfm7urQmn+QRSXJwMO7X5kAJJLbkVGJFt9Pm9VXPwQVrK2aaqiXlpusj+7DfDw00OULmYMmZDTqXM0nUVLxj13z0LhMQoQhhNG8utdUn4uKOFceliTZ/xiP+A54GnX9620641bqw3ctfh9NNXPsTEK8hAUD7FDqUhVntHmoEYYEHq8X1tHHZYP49/f2iezTiE8AUaoZo42/jIWQIKohOGNUib2hEqMkW8NsR8vPihvNuqPc0zKZcl6359YFQdjiiW8kCRD/rsDOr9v1eYLFZKYloFyzFqEgj+jcG/V47elOjShJ5CCPwatXwP6HIloVwtgygFsnOFmCg6Ojoivfoz8Nw1qxFwg5OU2cq/1WbWNELKnaFg4eUWCAIJ/3ZIJsEPkgemZxGhE+hdiNn9dkQYBJs1kx2BxdIkJmQ9vJSKkrMz6lTxZM3IJ9mhmKS6zYdU1ppeAao0/ayte997DQParb/AHLN79g0iW1ad0z8ir5jAl0q3a+UZPTSa4YiSqC2PZ/gfxG5wvL2mKmeKowG0RXjmEp5iNxrni+T/HRLZOoH7y0DQ24nMCPg";
const CERT2 = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGHsL0Ccm0ELINFZ2IaBhKaeWnVuh0o6nZLCioCn9xpSADzwIS5VCWO+1eVXT2atJOyf7FYlpB0/JA3Us+aQtekuIkHu/zBXijORZ4ClF4+sF3cSTNg6gY/+6iwLK/zs3bMg+GeJrcI65vXfs95Shxlb2Rd5GRT2/2yBmR6Zkf5QwMJuptUHWtM26WY7/xlkEKGFZVqOSylusiOzSALa815zC6dCiHoJNLBEKMlaZZQOk57/+OYoU5zzTaEgLhyvNFHSyAlyLQ3SGFtVHAaJZHSmmSPyJowCOB+92Gkk6SWVMsk6FbU8QJWFtlhzV/W/gZ7WzUlS/AKgN0th9/cq20ToFkW7X9c+rtYavufmuieqFhXgaMD8AGsoN9QC/HzNC9D1nydPfFYEUr9BHVy2nF5gM58Y59r2rT8p5LPARIkUp8g+5DLhyW0tdZFZ1305o4AHCayZnp5rjcU2Xi/c1Qf/djBGakmijlMs4aMzKJYD0c4Q8jdI7sNyd876K2wRD+L6KeD2QB3PtCS4P7BWAl5gh5CJ6ZBrwcaKXZqcSjEwm52MqVCgYZdapAaNYUy/QndttjLOG0wxxwuX1hIhMjPnIKZR1kwnqD5EqlHpilrnojRZvjVGN4zEKmilS8rNstt4HHs/D849W+Q6LRVWiWMs0cT2IugrX+Skxd8En7Gq52UEmuVBrSTpN+UpIu20NsVb9lsvuYh3XO441606tOEY2eKcZJdTtqrOTNqbbTk0zVn1yhbOCvmfctBNDhTwaC5QMi0P9wjU5XI9SBtkdQLizc5oqpoiHeqgb8+aJHVLcbgIJ/KLZKtRWFDfzRNM02Csx4etUUapVd2NA/L0oMs/O5T9sVj9FBJ7q99GWr3PVmxJb36mHZLXC4k1gGN9swE0LtzYsUdT5tUo9ri/hS3W/SM+F1p4Kh4QIgRcG3ciIHGN44bnDh3HDCz0fDnzKYw0bclMxZPctEyJ5gEOPF6OAkjD9dEaRGq/tEPf1k9Aub+v2dEjnfrYWAm4E5Zfhs2Xh0CT0k+SzhgKd0K/46ChJ20G5+blwpIvahvTVS68+aVIX6CwXs4tcVx6FnmVsMOOkIasfaqQLZYbNBkuLoZnQAq4j8yRekrQ==";

cmd({
    pattern: "musicplayer",
    alias: ["mp3player", "neonplayer"],
    desc: "Main game-style interactive MP3 player via FATIMA-MD Rich Message",
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
                        botResponseId: "f6g80604-877g-49h1-b15d-614dcf992004",
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
                                    messageText: "FATIMA-MD Neon MP3 Hub"
                                }
                            ],
                            unifiedResponse: {
                                data: Buffer.from(JSON.stringify({
                                    "response_id": "8hf91f6g-2737-528g-0f3d-2g0g5e58f783",
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
        console.error('[MUSIC PLAYER ERROR]', e?.message || e);
        return await reply('❌ Gagal mengirim player: ' + (e?.message || e));
    }
});
