import { fileURLToPath } from 'url';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

const htmlPayload = `<style>
* { -webkit-tap-highlight-color: transparent; -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; box-sizing: border-box; }
body { margin: 0; background: transparent; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #eee; touch-action: manipulation; cursor: pointer; }
.sr-wrap { width: 100%; max-width: 640px; margin: auto; padding: 12px; }
.sr-card { background: rgba(18, 14, 26, 0.9); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(168, 85, 247, 0.15), 0 0 15px rgba(236, 72, 153, 0.2); }
.sr-header { padding: 14px 18px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); display: flex; justify-content: space-between; align-items: center; background: linear-gradient(90deg, rgba(168,85,247,0.05), rgba(236,72,153,0.05)); }
.sr-sub { font-size: 10px; letter-spacing: 2px; color: #a855f7; font-weight: 700; text-transform: uppercase; display: flex; align-items: center; gap: 4px; }
.sr-title { font-size: 20px; font-weight: 900; color: #fff; text-shadow: 0 0 10px rgba(168, 85, 247, 0.6); letter-spacing: 1px; }
.sr-stats { text-align: right; display: flex; align-items: center; gap: 14px; }
.sr-score { font-size: 20px; font-weight: 900; color: #a855f7; text-shadow: 0 0 12px rgba(168, 85, 247, 0.8); }
.sr-best { font-size: 10px; color: rgba(255, 255, 255, 0.5); font-weight: 600; margin-top: 1px; display: flex; align-items: center; justify-content: flex-end; gap: 3px; }
.sr-audio-btn { background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease; padding: 0; }
.sr-audio-btn:active { transform: scale(0.9); }
.sr-body { padding: 14px; position: relative; }
canvas#game { width: 100%; height: auto; background: #0c0814; border: 1px solid rgba(168, 85, 247, 0.2); border-radius: 12px; display: block; box-shadow: inset 0 0 20px rgba(0,0,0,0.8); }
.sr-status { display: flex; justify-content: space-between; margin-top: 8px; font-size: 11px; color: rgba(255, 255, 255, 0.6); font-weight: 600; }
.svg-icon { display: inline-block; vertical-align: middle; }
</style>

<div class="sr-wrap">
  <div class="sr-card">
    <div class="sr-header">
      <div>
        <div class="sr-sub">
          <svg class="svg-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="3"></circle><path d="M12 8v8m-4 1l4-3 4 3M8 12h8"></path></svg>
          FATIMA-MD ARCADE
        </div>
        <div class="sr-title">Stickman Sprint</div>
      </div>
      <div class="sr-stats">
        <button id="soundToggle" class="sr-audio-btn" title="Toggle Sound">
          <svg id="iconAudioOn" class="svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
          <svg id="iconAudioOff" class="svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
        </button>
        <div>
          <div id="score" class="sr-score">0000</div>
          <div id="best" class="sr-best">
            <svg class="svg-icon" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"></path></svg>
            <span id="bestText">BEST 0000</span>
          </div>
        </div>
      </div>
    </div>
    <div class="sr-body">
      <canvas id="game" width="640" height="360"></canvas>
      <div class="sr-status">
        <span id="gameStatus">Tap to Jump / Double Jump</span>
        <span id="speedStatus">Speed 5.5x</span>
      </div>
      <div style="font-size: 10px; color: rgba(168, 85, 247, 0.5); text-align: center; margin-top: 6px; font-weight: 600; letter-spacing: 1px;">WM: FATIMA-MD</div>
    </div>
  </div>
</div>

<script>
(function() {
  const c = document.getElementById('game');
  const ctx = c.getContext('2d');
  const scoreEl = document.getElementById('score');
  const bestTextEl = document.getElementById('bestText');
  const gameStatus = document.getElementById('gameStatus');
  const speedStatus = document.getElementById('speedStatus');
  const soundBtn = document.getElementById('soundToggle');
  const iconAudioOn = document.getElementById('iconAudioOn');
  const iconAudioOff = document.getElementById('iconAudioOff');

  const GY = 285;
  const P_W = 24;
  const P_H = 42;

  let audioCtx = null;
  let soundMuted = false;

  function initAudio() {
    if (!audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) audioCtx = new AudioCtx();
    }
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  }

  soundBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    soundMuted = !soundMuted;
    iconAudioOn.style.display = soundMuted ? 'none' : 'inline-block';
    iconAudioOff.style.display = soundMuted ? 'inline-block' : 'none';
  });

  function playSound(type) {
    if (soundMuted) return;
    initAudio();
    if (!audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      if (type === 'jump') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(250, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.12);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(now); osc.stop(now + 0.12);
      } else if (type === 'double') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.14);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(now); osc.stop(now + 0.14);
      } else if (type === 'crash') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.25);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(now); osc.stop(now + 0.25);
      }
    } catch(e) {}
  }

  let bestScore = 0;
  try { bestScore = parseInt(localStorage.getItem('sr_best') || 0, 10); } catch(e) {}

  const STATE_PLAYING = 1;
  const STATE_GAMEOVER = 2;

  let gameState = STATE_PLAYING;
  let player, obstacles, particles, bgCity;
  let score, speed, spawnTimer, lastTime, shake, animFrame;

  function resetGame() {
    player = {
      x: 80,
      y: GY - P_H,
      w: P_W,
      h: P_H,
      vy: 0,
      isGrounded: true,
      jumpCount: 0,
      maxJumps: 2
    };
    obstacles = [];
    particles = [];
    bgCity = [];
    for (let i = 0; i < 10; i++) {
      bgCity.push({
        x: i * 75,
        w: 55,
        h: Math.random() * 90 + 60,
        speed: 0.2
      });
    }
    score = 0;
    speed = 5.5;
    spawnTimer = 45;
    lastTime = 0;
    shake = 0;
    animFrame = 0;
    scoreEl.textContent = '0000';
    bestTextEl.textContent = 'BEST ' + String(Math.floor(bestScore)).padStart(4, '0');
  }

  function triggerJump() {
    initAudio();
    if (gameState === STATE_GAMEOVER) {
      resetGame();
      gameState = STATE_PLAYING;
      performJump();
      return;
    }
    if (gameState === STATE_PLAYING) {
      performJump();
    }
  }

  function performJump() {
    if (player.jumpCount < player.maxJumps) {
      player.vy = -12.0;
      player.isGrounded = false;
      player.jumpCount++;

      if (player.jumpCount === 1) {
        playSound('jump');
      } else {
        playSound('double');
        for(let i=0; i<6; i++) {
          particles.push({
            x: player.x + P_W/2,
            y: player.y + P_H,
            vx: (Math.random() - 0.5) * 4,
            vy: Math.random() * 2 + 1,
            life: 1.0,
            color: '#ec4899'
          });
        }
      }
    }
  }

  function update(dt) {
    if (gameState === STATE_PLAYING) {
      animFrame += speed * 0.15 * dt;
      player.vy += 0.72 * dt;
      player.y += player.vy * dt;

      if (player.y >= GY - P_H) {
        player.y = GY - P_H;
        player.vy = 0;
        player.isGrounded = true;
        player.jumpCount = 0;
      }

      spawnTimer -= dt;
      if (spawnTimer <= 0) {
        let type = Math.random();
        if (type < 0.5) {
          // Box barrier
          obstacles.push({ x: c.width + 20, y: GY - 28, w: 26, h: 28, type: 'box' });
        } else if (type < 0.8) {
          // Tall barrier
          obstacles.push({ x: c.width + 20, y: GY - 52, w: 22, h: 52, type: 'tall' });
        } else {
          // Double obstacles
          obstacles.push({ x: c.width + 20, y: GY - 28, w: 24, h: 28, type: 'box' });
          obstacles.push({ x: c.width + 55, y: GY - 28, w: 24, h: 28, type: 'box' });
        }
        spawnTimer = Math.max(40, 80 - speed * 3.5) + Math.random() * 30;
      }

      obstacles.forEach(o => o.x -= speed * dt);
      obstacles = obstacles.filter(o => o.x > -60);

      bgCity.forEach(b => {
        b.x -= b.speed * speed * dt;
        if (b.x + b.w < 0) {
          b.x = c.width;
          b.h = Math.random() * 90 + 60;
        }
      });

      particles.forEach(p => {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= 0.05 * dt;
      });
      particles = particles.filter(p => p.life > 0);

      speed = Math.min(11.5, speed + 0.0012 * dt);
      score += dt * 0.6;
      scoreEl.textContent = String(Math.floor(score)).padStart(4, '0');
      speedStatus.textContent = 'Speed ' + speed.toFixed(1) + 'x';

      if (score > bestScore) {
        bestScore = score;
        try { localStorage.setItem('sr_best', Math.floor(bestScore)); } catch(e) {}
        bestTextEl.textContent = 'BEST ' + String(Math.floor(bestScore)).padStart(4, '0');
      }

      for (let o of obstacles) {
        // Tight hitbox for smooth running gameplay
        if (player.x + 4 < o.x + o.w && player.x + player.w - 4 > o.x && player.y + 4 < o.y + o.h && player.y + player.h - 2 > o.y) {
          gameState = STATE_GAMEOVER;
          shake = 14;
          playSound('crash');
          break;
        }
      }
    }
    if (shake > 0) shake = Math.max(0, shake - 0.6 * dt);
  }

  function drawStickman(x, y, isGrounded, animFrame, vy) {
    ctx.strokeStyle = '#a855f7';
    ctx.fillStyle = '#a855f7';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Head
    ctx.beginPath();
    ctx.arc(x + P_W/2, y + 8, 7, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.beginPath();
    ctx.moveTo(x + P_W/2, y + 15);
    ctx.lineTo(x + P_W/2, y + 28);
    ctx.stroke();

    // Arms & Legs animation
    let legOffset = isGrounded ? Math.sin(animFrame) * 8 : (vy < 0 ? -4 : 6);
    let armOffset = isGrounded ? Math.cos(animFrame) * 8 : (vy < 0 ? -6 : 4);

    // Arms
    ctx.beginPath();
    ctx.moveTo(x + P_W/2, y + 18);
    ctx.lineTo(x + P_W/2 + 10, y + 22 + armOffset);
    ctx.moveTo(x + P_W/2, y + 18);
    ctx.lineTo(x + P_W/2 - 8, y + 22 - armOffset);
    ctx.stroke();

    // Legs
    ctx.beginPath();
    ctx.moveTo(x + P_W/2, y + 28);
    ctx.lineTo(x + P_W/2 + 8, y + P_H);
    ctx.moveTo(x + P_W/2, y + 28);
    ctx.lineTo(x + P_W/2 - 6 + legOffset, y + P_H);
    ctx.stroke();
  }

  function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.save();
    if (shake > 0) ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);

    // Background Gradient
    let bgGrad = ctx.createLinearGradient(0, 0, 0, c.height);
    bgGrad.addColorStop(0, '#090514');
    bgGrad.addColorStop(1, '#150c24');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, c.width, c.height);

    // City Skyline
    ctx.fillStyle = 'rgba(168, 85, 247, 0.08)';
    bgCity.forEach(b => {
      ctx.fillRect(b.x, GY - b.h, b.w, b.h);
    });

    // Ground Line
    ctx.strokeStyle = '#ec4899';
    ctx.shadowColor = '#ec4899';
    ctx.shadowBlur = 12;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, GY);
    ctx.lineTo(c.width, GY);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw Runner Stickman
    ctx.save();
    ctx.shadowColor = '#a855f7';
    ctx.shadowBlur = 10;
    drawStickman(player.x, player.y, player.isGrounded, animFrame, player.vy);
    ctx.restore();

    // Obstacles
    obstacles.forEach(o => {
      ctx.save();
      ctx.shadowColor = '#ec4899';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#ec4899';
      ctx.fillRect(o.x, o.y, o.w, o.h);

      // Inner accent
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(o.x + 4, o.y + 4, o.w - 8, 4);
      ctx.restore();
    });

    // Particles
    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, 3, 3);
      ctx.restore();
    });

    if (gameState === STATE_GAMEOVER) {
      ctx.fillStyle = 'rgba(12, 8, 20, 0.82)';
      ctx.fillRect(0, 0, c.width, c.height);

      ctx.textAlign = 'center';
      ctx.shadowColor = '#ec4899';
      ctx.shadowBlur = 18;
      ctx.font = '900 30px "Segoe UI", sans-serif';
      ctx.fillStyle = '#ec4899';
      ctx.fillText('GAME OVER', c.width / 2, c.height / 2 - 20);

      ctx.shadowBlur = 0;
      ctx.font = '700 15px "Segoe UI", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('SCORE: ' + Math.floor(score), c.width / 2, c.height / 2 + 12);

      ctx.font = '600 13px "Segoe UI", sans-serif';
      ctx.fillStyle = '#a855f7';
      ctx.fillText('Tap to Sprint Again', c.width / 2, c.height / 2 + 40);
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

  c.addEventListener('touchstart', (e) => { e.preventDefault(); triggerJump(); }, { passive: false });
  c.addEventListener('mousedown', triggerJump);
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
      e.preventDefault();
      triggerJump();
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
    pattern: "sticksprint",
    alias: ["runnergame", "stickman", "sprint"],
    desc: "Main game Stickman Sprint interaktif via FATIMA-MD Rich Message",
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
                        botResponseId: "d4e60492-655e-47f9-9f3b-492bec770882",
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
                                    messageText: "FATIMA-MD Stickman Sprint"
                                }
                            ],
                            unifiedResponse: {
                                data: Buffer.from(JSON.stringify({
                                    "response_id": "6fd79d4e-0515-406e-8d1b-0f8e3c36d561",
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
        console.error('[STICKMAN SPRINT ERROR]', e?.message || e);
        return await reply('❌ Gagal mengirim game: ' + (e?.message || e));
    }
});
