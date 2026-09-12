import { fileURLToPath } from 'url';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

const htmlPayload = `<style>
* { -webkit-tap-highlight-color: transparent; -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; box-sizing: border-box; }
body { margin: 0; background: transparent; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #eee; touch-action: manipulation; cursor: pointer; }
.tr-wrap { width: 100%; max-width: 640px; margin: auto; padding: 12px; }
.tr-card { background: rgba(20, 16, 10, 0.92); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(234, 179, 8, 0.4); border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(234, 179, 8, 0.2), 0 0 15px rgba(217, 119, 6, 0.3); }
.tr-header { padding: 14px 18px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); display: flex; justify-content: space-between; align-items: center; background: linear-gradient(90deg, rgba(234,179,8,0.08), rgba(217,119,6,0.08)); }
.tr-sub { font-size: 10px; letter-spacing: 2px; color: #eab308; font-weight: 700; text-transform: uppercase; display: flex; align-items: center; gap: 4px; }
.tr-title { font-size: 20px; font-weight: 900; color: #fff; text-shadow: 0 0 10px rgba(234, 179, 8, 0.6); letter-spacing: 1px; }
.tr-stats { text-align: right; display: flex; align-items: center; gap: 14px; }
.tr-score { font-size: 20px; font-weight: 900; color: #eab308; text-shadow: 0 0 12px rgba(234, 179, 8, 0.8); }
.tr-best { font-size: 10px; color: rgba(255, 255, 255, 0.5); font-weight: 600; margin-top: 1px; display: flex; align-items: center; justify-content: flex-end; gap: 3px; }
.tr-body { padding: 14px; position: relative; }
canvas#game { width: 100%; height: auto; background: #0f0b08; border: 1px solid rgba(234, 179, 8, 0.3); border-radius: 12px; display: block; box-shadow: inset 0 0 25px rgba(0,0,0,0.9); }
.tr-status { display: flex; justify-content: space-between; margin-top: 8px; font-size: 11px; color: rgba(255, 255, 255, 0.6); font-weight: 600; }
.svg-icon { display: inline-block; vertical-align: middle; }
</style>

<div class="tr-wrap">
  <div class="tr-card">
    <div class="tr-header">
      <div>
        <div class="tr-sub">
          <svg class="svg-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
          FATIMA-MD ARCADE
        </div>
        <div class="tr-title">Temple Runner 2D</div>
      </div>
      <div class="tr-stats">
        <div>
          <div id="score" class="tr-score">0000</div>
          <div id="best" class="tr-best">
            <span>BEST 0000</span>
          </div>
        </div>
      </div>
    </div>
    <div class="tr-body">
      <canvas id="game" width="640" height="360"></canvas>
      <div class="tr-status">
        <span id="gameStatus">Tap / Swipe to Dodge</span>
        <span id="speedStatus">Speed 5.0x</span>
      </div>
      <div style="font-size: 10px; color: rgba(234, 179, 8, 0.5); text-align: center; margin-top: 6px; font-weight: 600; letter-spacing: 1px;">WM: FATIMA-MD</div>
    </div>
  </div>
</div>

<script>
(function() {
  const c = document.getElementById('game');
  const ctx = c.getContext('2d');
  const scoreEl = document.getElementById('score');
  const bestEl = document.getElementById('best').querySelector('span');
  const gameStatus = document.getElementById('gameStatus');
  const speedStatus = document.getElementById('speedStatus');

  const LANES = [170, 320, 470]; // 3 lanes for temple path
  let playerLane = 1; // Middle lane
  let playerY = 280;
  let playerVY = 0;
  let isJumping = false;

  let bestScore = 0;
  try { bestScore = parseInt(localStorage.getItem('tr_best') || 0, 10); } catch(e) {}

  const STATE_PLAYING = 1;
  const STATE_GAMEOVER = 2;

  let gameState = STATE_PLAYING;
  let score, speed, obstacles, coins, particles, lastTime, shake, runDist;

  function resetGame() {
    playerLane = 1;
    playerY = 280;
    playerVY = 0;
    isJumping = false;
    obstacles = [];
    coins = [];
    particles = [];
    score = 0;
    speed = 5.0;
    lastTime = 0;
    shake = 0;
    runDist = 0;
    scoreEl.textContent = '0000';
    bestEl.textContent = 'BEST ' + String(Math.floor(bestScore)).padStart(4, '0');
  }

  function handleAction(dir) {
    if (gameState === STATE_GAMEOVER) {
      resetGame();
      gameState = STATE_PLAYING;
      return;
    }
    if (dir === 'left' && playerLane > 0) playerLane--;
    if (dir === 'right' && playerLane < 2) playerLane++;
    if (dir === 'jump' && !isJumping) {
      playerVY = -11;
      isJumping = true;
    }
  }

  function update(dt) {
    if (gameState === STATE_PLAYING) {
      runDist += speed * dt;
      playerY += playerVY * dt;
      if (isJumping) {
        playerVY += 0.65 * dt;
        if (playerY >= 280) {
          playerY = 280;
          playerVY = 0;
          isJumping = false;
        }
      }

      // Spawn obstacles & coins
      if (Math.random() < 0.03 * dt) {
        let lane = Math.floor(Math.random() * 3);
        obstacles.push({ lane: lane, z: 400, w: 50, h: 50 });
      }
      if (Math.random() < 0.04 * dt) {
        let lane = Math.floor(Math.random() * 3);
        coins.push({ lane: lane, z: 400, r: 12 });
      }

      // Move obstacles
      obstacles.forEach(o => o.z -= speed * dt);
      obstacles = obstacles.filter(o => o.z > 0);

      // Move coins
      coins.forEach(cn => cn.z -= speed * dt);
      coins = coins.filter(cn => cn.z > 0);

      speed = Math.min(10.0, speed + 0.0008 * dt);
      score += dt * 0.5;
      scoreEl.textContent = String(Math.floor(score)).padStart(4, '0');
      speedStatus.textContent = 'Speed ' + speed.toFixed(1) + 'x';

      if (score > bestScore) {
        bestScore = score;
        try { localStorage.setItem('tr_best', Math.floor(bestScore)); } catch(e) {}
        bestEl.textContent = 'BEST ' + String(Math.floor(bestScore)).padStart(4, '0');
      }

      // Collision check
      obstacles.forEach(o => {
        if (o.lane === playerLane && o.z < 60 && o.z > 20 && (!isJumping || playerY > 240)) {
          gameState = STATE_GAMEOVER;
          shake = 15;
        }
      });

      // Coin collection check
      coins.forEach((cn, idx) => {
        if (cn.lane === playerLane && cn.z < 55 && cn.z > 25) {
          score += 20;
          coins.splice(idx, 1);
        }
      });
    }
    if (shake > 0) shake = Math.max(0, shake - 0.5 * dt);
  }

  function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.save();
    if (shake > 0) ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);

    // Background jungle/sky gradient
    let bg = ctx.createLinearGradient(0, 0, 0, c.height);
    bg.addColorStop(0, '#1a120b');
    bg.addColorStop(0.5, '#2c1e11');
    bg.addColorStop(1, '#0f0b08');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, c.width, c.height);

    // Temple Path (Perspective Triangles)
    ctx.fillStyle = '#3a2717';
    ctx.beginPath();
    ctx.moveTo(120, 360);
    ctx.lineTo(260, 160);
    ctx.lineTo(380, 160);
    ctx.lineTo(520, 360);
    ctx.closePath();
    ctx.fill();

    // Path Stone Texture Lines
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.3;
    let offset = (runDist * 10) % 40;
    for (let y = 160 + offset; y < 360; y += 40) {
      let wRatio = (y - 160) / 200;
      let x1 = 260 - wRatio * 140;
      let x2 = 380 + wRatio * 140;
      ctx.beginPath();
      ctx.moveTo(x1, y);
      ctx.lineTo(x2, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;

    // Draw Coins
    coins.forEach(cn => {
      let scale = 30 / cn.z;
      let laneX = LANES[cn.lane];
      let x = c.width / 2 + (laneX - 320) * scale * 1.5;
      let y = 160 + (360 - 160) * (1 - cn.z / 400);
      
      ctx.fillStyle = '#eab308';
      ctx.shadowColor = '#eab308';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(x, y - 20, cn.r * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Draw Obstacles (Ancient Statues/Boulders)
    obstacles.forEach(o => {
      let scale = 40 / o.z;
      let laneX = LANES[o.lane];
      let x = c.width / 2 + (laneX - 320) * scale * 1.5;
      let y = 160 + (360 - 160) * (1 - o.z / 400);

      ctx.fillStyle = '#d97706';
      ctx.shadowColor = '#d97706';
      ctx.shadowBlur = 10;
      ctx.fillRect(x - (o.w * scale) / 2, y - o.h * scale, o.w * scale, o.h * scale);
      ctx.shadowBlur = 0;
    });

    // Draw Player (Explorer)
    let pX = LANES[playerLane];
    ctx.fillStyle = '#f59e0b';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 12;
    ctx.fillRect(pX - 15, playerY - 40, 30, 40);
    // Explorer head
    ctx.fillStyle = '#ffedd5';
    ctx.fillRect(pX - 10, playerY - 56, 20, 18);
    ctx.shadowBlur = 0;

    if (gameState === STATE_GAMEOVER) {
      ctx.fillStyle = 'rgba(15, 11, 8, 0.85)';
      ctx.fillRect(0, 0, c.width, c.height);

      ctx.textAlign = 'center';
      ctx.shadowColor = '#eab308';
      ctx.shadowBlur = 20;
      ctx.font = '900 28px "Segoe UI", sans-serif';
      ctx.fillStyle = '#eab308';
      ctx.fillText('CAUGHT BY MONSTERS!', c.width / 2, c.height / 2 - 20);

      ctx.shadowBlur = 0;
      ctx.font = '700 15px "Segoe UI", sans-serif';
      ctx.fillStyle = '#fff';
      ctx.fillText('Tap to Run Again', c.width / 2, c.height / 2 + 20);
    }

    ctx.restore();
  }

  function loop(time) {
    if (!lastTime) lastTime = time;
    let dt = Math.min((time - lastTime) / 16.67, 2.0);
    lastTime = time;
    update(dt);
    draw();
    requestAnimationFrame(loop);
  }

  // Touch & Swipe Controls
  let touchStartX = 0;
  let touchStartY = 0;

  c.addEventListener('touchstart', (e) => {
    e.preventDefault();
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: false });

  c.addEventListener('touchend', (e) => {
    let diffX = e.changedTouches[0].clientX - touchStartX;
    let diffY = e.changedTouches[0].clientY - touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 30) handleAction('right');
      else if (diffX < -30) handleAction('left');
    } else {
      if (diffY < -30) handleAction('jump');
      else handleAction('jump'); // Tap or Swipe down fallback
    }
  });

  c.addEventListener('click', () => {
    handleAction('jump');
  });

  window.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') handleAction('left');
    if (e.code === 'ArrowRight' || e.code === 'KeyD') handleAction('right');
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
      e.preventDefault();
      handleAction('jump');
    }
  });

  resetGame();
  requestAnimationFrame(loop);
})();
</script>`;

const SIG = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LVZlcmlmaWNhdGlvblNpZ25hdHVyZS5NZXRhZGF0YeN55YRyad2+ZA==";
const CERT1 = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGEOvtJr968bbpKdZreOTwkk9aPN++XPE60RfuzNLkXXc7LE8BOkJOWRpo2oNXaRJ3uCNJ43HY3A+oetnvHSfcxWqmvvTSrBOI5V1NOD6RMsZ/st1XVPUx83AGps1l5jYBOYzqMNy6un2tToJ2Bt9bXRo29tWLZTu8m7TNY/hISwVpVc5tjSet5U7btPN+dMIx2UvykB1jcbWGsdklheeuz8RXSStNXzeaGvsf1lpZ/ugLE4b2BdmlRNKrY6zLE4qFtRYQoS7axOyQX+4QUyN2m9bfm7urQmn+QRSXJwMO7X5kAJJLbkVGJFt9Pm9VXPwQVrK2aaqiXlpusj+7DfDw00OULmYMmZDTqXM0nUVLxj13z0LhMQoQhhNG8utdUn4uKOFceliTZ/xiP+A54GnX9620641bqw3ctfh9NNXPsTEK8hAUD7FDqUhVntHmoEYYEHq8X1tHHZYP49/f2iezTiE8AUaoZo42/jIWQIKohOGNUib2hEqMkW8NsR8vPihvNuqPc0zKZcl6359YFQdjiiW8kCRD/rsDOr9v1eYLFZKYloFyzFqEgj+jcG/V47elOjShJ5CCPwatXwP6HIloVwtgygFsnOFmCg6Ojoivfoz8Nw1qxFwg5OU2cq/1WbWNELKnaFg4eUWCAIJ/3ZIJsEPkgemZxGhE+hdiNn9dkQYBJs1kx2BxdIkJmQ9vJSKkrMz6lTxZM3IJ9mhmKS6zYdU1ppeAao0/ayte997DQParb/AHLN79g0iW1ad0z8ir5jAl0q3a+UZPTSa4YiSqC2PZ/gfxG5wvL2mKmeKowG0RXjmEp5iNxrni+T/HRLZOoH7y0DQ24nMCPg";
const CERT2 = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGHsL0Ccm0ELINFZ2IaBhKaeWnVuh0o6nZLCioCn9xpSADzwIS5VCWO+1eVXT2atJOyf7FYlpB0/JA3Us+aQtekuIkHu/zBXijORZ4ClF4+sF3cSTNg6gY/+6iwLK/zs3bMg+GeJrcI65vXfs95Shxlb2Rd5GRT2/2yBmR6Zkf5QwMJuptUHWtM26WY7/xlkEKGFZVqOSylusiOzSALa815zC6dCiHoJNLBEKMlaZZQOk57/+OYoU5zzTaEgLhyvNFHSyAlyLQ3SGFtVHAaJZHSmmSPyJowCOB+92Gkk6SWVMsk6FbU8QJWFtlhzV/W/gZ7WzUlS/AKgN0th9/cq20ToFkW7X9c+rtYavufmuieqFhXgaMD8AGsoN9QC/HzNC9D1nydPfFYEUr9BHVy2nF5gM58Y59r2rT8p5LPARIkUp8g+5DLhyW0tdZFZ1305o4AHCayZnp5rjcU2Xi/c1Qf/djBGakmijlMs4aMzKJYD0c4Q8jdI7sNyd876K2wRD+L6KeD2QB3PtCS4P7BWAl5gh5CJ6ZBrwcaKXZqcSjEwm52MqVCgYZdapAaNYUy/QndttjLOG0wxxwuX1hIhMjPnIKZR1kwnqD5EqlHpilrnojRZvjVGN4zEKmilS8rNstt4HHs/D849W+Q6LRVWiWMs0cT2IugrX+Skxd8En7Gq52UEmuVBrSTpN+UpIu20NsVb9lsvuYh3XO441606tOEY2eKcZJdTtqrOTNqbbTk0zVn1yhbOCvmfctBNDhTwaC5QMi0P9wjU5XI9SBtkdQLizc5oqpoiHeqgb8+aJHVLcbgIJ/KLZKtRWFDfzRNM02Csx4etUUapVd2NA/L0oMs/O5T9sVj9FBJ7q99GWr3PVmxJb36mHZLXC4k1gGN9swE0LtzYsUdT5tUo9ri/hS3W/SM+F1p4Kh4QIgRcG3ciIHGN44bnDh3HDCz0fDnzKYw0bclMxZPctEyJ5gEOPF6OAkjD9dEaRGq/tEPf1k9Aub+v2dEjnfrYWAm4E5Zfhs2Xh0CT0k+SzhgKd0K/46ChJ20G5+blwpIvahvTVS68+aVIX6CwXs4tcVx6FnmVsMOOkIasfaqQLZYbNBkuLoZnQAq4j8yRekrQ==";

cmd({
    pattern: "templerun",
    alias: ["run", "temple"],
    desc: "Main game Temple Runner 2D interaktif via FATIMA-MD Rich Message",
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
                        botResponseId: "i9j12937-100j-72k4-e48g-947ggd225337",
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
                                    messageText: "FATIMA-MD Temple Runner 2D"
                                }
                            ],
                            unifiedResponse: {
                                data: Buffer.from(JSON.stringify({
                                    "response_id": "1ki24i9j-5060-851i-3h6g-5j3j8h81i016",
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
        console.error('[TEMPLE RUN ERROR]', e?.message || e);
        return await reply('❌ Gagal mengirim game: ' + (e?.message || e));
    }
});
