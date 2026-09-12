import { fileURLToPath } from 'url';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

const htmlPayload = `<style>
* { -webkit-tap-highlight-color: transparent; -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; box-sizing: border-box; }
body { margin: 0; background: transparent; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #eee; touch-action: manipulation; cursor: pointer; }
.mp-wrap { width: 100%; max-width: 640px; margin: auto; padding: 12px; }
.mp-card { background: rgba(15, 18, 28, 0.95); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(168, 85, 247, 0.4); border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(168, 85, 247, 0.2), 0 0 15px rgba(236, 72, 153, 0.2); }
.mp-header { padding: 14px 18px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); display: flex; justify-content: space-between; align-items: center; background: linear-gradient(90deg, rgba(168,85,247,0.08), rgba(236,72,153,0.08)); }
.mp-sub { font-size: 10px; letter-spacing: 2px; color: #a855f7; font-weight: 700; text-transform: uppercase; display: flex; align-items: center; gap: 4px; }
.mp-title { font-size: 20px; font-weight: 900; color: #fff; text-shadow: 0 0 10px rgba(168, 85, 247, 0.6); letter-spacing: 1px; }
.mp-body { padding: 16px; display: flex; flex-direction: column; align-items: center; position: relative; }
.player-screen { width: 100%; background: #080b12; border: 1px solid rgba(168, 85, 247, 0.25); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; align-items: center; box-shadow: inset 0 0 20px rgba(0,0,0,0.8); }
.vinyl-disc { width: 130px; height: 130px; border-radius: 50%; background: radial-gradient(circle, #1e293b 25%, #0f172a 26%, #020617 70%); border: 4px solid #334155; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px rgba(0,0,0,0.8); margin-bottom: 14px; transition: transform 0.3s linear; }
.vinyl-disc.spin { animation: spin 3s linear infinite; }
.vinyl-center { width: 40px; height: 40px; border-radius: 50%; background: #ec4899; border: 2px solid #fff; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 900; color: #fff; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
.track-info { text-align: center; margin-bottom: 14px; width: 100%; }
.track-name { font-size: 16px; font-weight: 800; color: #fff; margin-bottom: 4px; }
.track-artist { font-size: 11px; color: rgba(255,255,255,0.5); font-weight: 600; }
.progress-bar-wrap { width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; margin-bottom: 14px; overflow: hidden; cursor: pointer; position: relative; }
.progress-bar-fill { width: 0%; height: 100%; background: linear-gradient(90deg, #a855f7, #ec4899); border-radius: 3px; }
.player-actions { display: flex; align-items: center; gap: 16px; margin-bottom: 8px; }
.action-btn { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 50%; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #fff; transition: all 0.2s; }
.action-btn.play-main { width: 56px; height: 56px; background: #a855f7; border-color: #a855f7; box-shadow: 0 0 15px rgba(168, 85, 247, 0.6); }
.action-btn:active { transform: scale(0.92); }
.svg-icon { display: inline-block; vertical-align: middle; }
</style>

<div class="mp-wrap">
  <div class="mp-card">
    <div class="mp-header">
      <div>
        <div class="mp-sub">
          <svg class="svg-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
          FATIMA-MD MEDIA
        </div>
        <div class="mp-title">Live MP3 Streamer</div>
      </div>
    </div>
    <div class="mp-body">
      <div class="player-screen">
        <div id="vinyl" class="vinyl-disc">
          <div class="vinyl-center">LIVE</div>
        </div>
        <div class="track-info">
          <div id="trackName" class="track-name">Lo-Fi Chill & Synthwave</div>
          <div id="trackArtist" class="track-artist">Live Audio Stream</div>
        </div>
        <div class="progress-bar-wrap" onclick="seekAudio(event)">
          <div id="progressBar" class="progress-bar-fill"></div>
        </div>
        <div class="player-actions">
          <button class="action-btn play-main" onclick="togglePlay()" id="playBtn">
            <svg id="playIcon" class="svg-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            <svg id="pauseIcon" class="svg-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:none"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
          </button>
        </div>
      </div>
      <div style="font-size: 10px; color: rgba(168, 85, 247, 0.5); text-align: center; margin-top: 10px; font-weight: 600; letter-spacing: 1px;">WM: FATIMA-MD</div>
    </div>
  </div>
</div>

<audio id="audioStream" src="https://stream.zeno.fm/f3wvbbqmdg8uv" preload="none"></audio>

<script>
const audio = document.getElementById('audioStream');
const vinyl = document.getElementById('vinyl');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const progressBar = document.getElementById('progressBar');

function togglePlay() {
  if (audio.paused) {
    audio.play().then(() => {
      vinyl.className = 'vinyl-disc spin';
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'inline-block';
    }).catch(e => {
      alert('Stream play karne mein error aaya.');
    });
  } else {
    audio.pause();
    vinyl.className = 'vinyl-disc';
    playIcon.style.display = 'inline-block';
    pauseIcon.style.display = 'none';
  }
}

audio.addEventListener('timeupdate', () => {
  if (audio.duration) {
    let p = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = p + '%';
  }
});

function seekAudio(e) {
  let rect = e.currentTarget.getBoundingClientRect();
  let clickX = e.clientX - rect.left;
  let width = rect.width;
  if (audio.duration) {
    audio.currentTime = (clickX / width) * audio.duration;
  }
}
</script>`;

const SIG = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LVZlcmlmaWNhdGlvblNpZ25hdHVyZS5NZXRhZGF0YeN55YRyad2+ZA==";
const CERT1 = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGEOvtJr968bbpKdZreOTwkk9aPN++XPE60RfuzNLkXXc7LE8BOkJOWRpo2oNXaRJ3uCNJ43HY3A+oetnvHSfcxWqmvvTSrBOI5V1NOD6RMsZ/st1XVPUx83AGps1l5jYBOYzqMNy6un2tToJ2Bt9bXRo29tWLZTu8m7TNY/hISwVpVc5tjSet5U7btPN+dMIx2UvykB1jcbWGsdklheeuz8RXSStNXzeaGvsf1lpZ/ugLE4b2BdmlRNKrY6zLE4qFtRYQoS7axOyQX+4QUyN2m9bfm7urQmn+QRSXJwMO7X5kAJJLbkVGJFt9Pm9VXPwQVrK2aaqiXlpusj+7DfDw00OULmYMmZDTqXM0nUVLxj13z0LhMQoQhhNG8utdUn4uKOFceliTZ/xiP+A54GnX9620641bqw3ctfh9NNXPsTEK8hAUD7FDqUhVntHmoEYYEHq8X1tHHZYP49/f2iezTiE8AUaoZo42/jIWQIKohOGNUib2hEqMkW8NsR8vPihvNuqPc0zKZcl6359YFQdjiiW8kCRD/rsDOr9v1eYLFZKYloFyzFqEgj+jcG/V47elOjShJ5CCPwatXwP6HIloVwtgygFsnOFmCg6Ojoivfoz8Nw1qxFwg5OU2cq/1WbWNELKnaFg4eUWCAIJ/3ZIJsEPkgemZxGhE+hdiNn9dkQYBJs1kx2BxdIkJmQ9vJSKkrMz6lTxZM3IJ9mhmKS6zYdU1ppeAao0/ayte997DQParb/AHLN79g0iW1ad0z8ir5jAl0q3a+UZPTSa4YiSqC2PZ/gfxG5wvL2mKmeKowG0RXjmEp5iNxrni+T/HRLZOoH7y0DQ24nMCPg";
const CERT2 = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGHsL0Ccm0ELINFZ2IaBhKaeWnVuh0o6nZLCioCn9xpSADzwIS5VCWO+1eVXT2atJOyf7FYlpB0/JA3Us+aQtekuIkHu/zBXijORZ4ClF4+sF3cSTNg6gY/+6iwLK/zs3bMg+GeJrcI65vXfs95Shxlb2Rd5GRT2/2yBmR6Zkf5QwMJuptUHWtM26WY7/xlkEKGFZVqOSylusiOzSALa815zC6dCiHoJNLBEKMlaZZQOk57/+OYoU5zzTaEgLhyvNFHSyAlyLQ3SGFtVHAaJZHSmmSPyJowCOB+92Gkk6SWVMsk6FbU8QJWFtlhzV/W/gZ7WzUlS/AKgN0th9/cq20ToFkW7X9c+rtYavufmuieqFhXgaMD8AGsoN9QC/HzNC9D1nydPfFYEUr9BHVy2nF5gM58Y59r2rT8p5LPARIkUp8g+5DLhyW0tdZFZ1305o4AHCayZnp5rjcU2Xi/c1Qf/djBGakmijlMs4aMzKJYD0c4Q8jdI7sNyd876K2wRD+L6KeD2QB3PtCS4P7BWAl5gh5CJ6ZBrwcaKXZqcSjEwm52MqVCgYZdapAaNYUy/QndttjLOG0wxxwuX1hIhMjPnIKZR1kwnqD5EqlHpilrnojRZvjVGN4zEKmilS8rNstt4HHs/D849W+Q6LRVWiWMs0cT2IugrX+Skxd8En7Gq52UEmuVBrSTpN+UpIu20NsVb9lsvuYh3XO441606tOEY2eKcZJdTtqrOTNqbbTk0zVn1yhbOCvmfctBNDhTwaC5QMi0P9wjU5XI9SBtkdQLizc5oqpoiHeqgb8+aJHVLcbgIJ/KLZKtRWFDfzRNM02Csx4etUUapVd2NA/L0oMs/O5T9sVj9FBJ7q99GWr3PVmxJb36mHZLXC4k1gGN9swE0LtzYsUdT5tUo9ri/hS3W/SM+F1p4Kh4QIgRcG3ciIHGN44bnDh3HDCz0fDnzKYw0bclMxZPctEyJ5gEOPF6OAkjD9dEaRGq/tEPf1k9Aub+v2dEjnfrYWAm4E5Zfhs2Xh0CT0k+SzhgKd0K/46ChJ20G5+blwpIvahvTVS68+aVIX6CwXs4tcVx6FnmVsMOOkIasfaqQLZYbNBkuLoZnQAq4j8yRekrQ==";

cmd({
    pattern: "livemusic",
    alias: ["livestream", "mp3live"],
    desc: "Live audio streaming player via FATIMA-MD Rich Message",
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
                        botResponseId: "g7h91715-988h-50i2-c26e-725eed003115",
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
                                    messageText: "FATIMA-MD Live MP3 Streamer"
                                }
                            ],
                            unifiedResponse: {
                                data: Buffer.from(JSON.stringify({
                                    "response_id": "9ig02g7h-3848-639h-1g4e-3h1h6f69g894",
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
        console.error('[LIVE MUSIC ERROR]', e?.message || e);
        return await reply('❌ Gagal mengirim player: ' + (e?.message || e));
    }
});
