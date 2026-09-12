import { fileURLToPath } from 'url';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

const htmlPayload = `<style>
* { -webkit-tap-highlight-color: transparent; -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; box-sizing: border-box; }
body { margin: 0; background: transparent; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #eee; touch-action: manipulation; cursor: pointer; }
.yl-wrap { width: 100%; max-width: 640px; margin: auto; padding: 12px; }
.yl-card { background: rgba(15, 23, 42, 0.92); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(234, 179, 8, 0.35); border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(234, 179, 8, 0.18), 0 0 15px rgba(59, 130, 246, 0.2); }
.yl-header { padding: 12px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); display: flex; justify-content: space-between; align-items: center; background: linear-gradient(90deg, rgba(234,179,8,0.08), rgba(59,130,246,0.08)); }
.yl-sub { font-size: 10px; letter-spacing: 2px; color: #eab308; font-weight: 700; text-transform: uppercase; display: flex; align-items: center; gap: 4px; }
.yl-title { font-size: 18px; font-weight: 900; color: #fff; text-shadow: 0 0 10px rgba(234, 179, 8, 0.6); letter-spacing: 0.5px; }
.yl-controls { display: flex; gap: 8px; align-items: center; }
.yl-btn { background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; padding: 6px 12px; font-size: 11px; font-weight: 700; color: #fff; cursor: pointer; transition: all 0.2s; }
.yl-btn:active { transform: scale(0.92); }
.yl-btn.active { background: #eab308; color: #000; border-color: #eab308; }
.yl-body { padding: 12px; position: relative; display: flex; flex-direction: column; align-items: center; }
.board-container { position: relative; width: 320px; height: 320px; background: #1e293b; border: 3px solid #334155; border-radius: 8px; box-shadow: inset 0 0 15px rgba(0,0,0,0.8); display: grid; grid-template-columns: repeat(15, 1fr); grid-template-rows: repeat(15, 1fr); }
.cell { border: 1px solid rgba(255,255,255,0.03); display: flex; align-items: center; justify-content: center; font-size: 8px; font-weight: bold; position: relative; }
.home-red { grid-column: 1 / 7; grid-row: 1 / 7; background: rgba(239, 68, 68, 0.25); border: 2px solid #ef4444; display: grid; grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(2, 1fr); padding: 12px; gap: 8px; }
.home-green { grid-column: 10 / 16; grid-row: 1 / 7; background: rgba(34, 197, 94, 0.25); border: 2px solid #22c55e; display: grid; grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(2, 1fr); padding: 12px; gap: 8px; }
.home-yellow { grid-column: 1 / 7; grid-row: 10 / 16; background: rgba(234, 179, 8, 0.25); border: 2px solid #eab308; display: grid; grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(2, 1fr); padding: 12px; gap: 8px; }
.home-blue { grid-column: 10 / 16; grid-row: 10 / 16; background: rgba(59, 130, 246, 0.25); border: 2px solid #3b82f6; display: grid; grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(2, 1fr); padding: 12px; gap: 8px; }

.base-slot { background: #fff; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; margin: auto; box-shadow: 0 2px 4px rgba(0,0,0,0.4); }

.center-zone { grid-column: 7 / 10; grid-row: 7 / 10; background: #0f172a; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900; color: #eab308; text-align: center; border: 1px solid #475569; }

/* Pawns */
.pawn { width: 16px; height: 16px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.5); cursor: pointer; transition: transform 0.15s; z-index: 10; }
.pawn:hover { transform: scale(1.2); }
.pawn.red { background: #ef4444; }
.pawn.green { background: #22c55e; }
.pawn.yellow { background: #eab308; }
.pawn.blue { background: #3b82f6; }

.yl-hud { width: 100%; max-width: 320px; display: flex; justify-content: space-between; align-items: center; margin-top: 12px; background: rgba(255,255,255,0.05); padding: 10px 14px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); }
.turn-indicator { font-size: 12px; font-weight: 700; display: flex; align-items: center; gap: 6px; }
.turn-dot { width: 12px; height: 12px; border-radius: 50%; }
.dice-box { background: #fff; color: #000; width: 42px; height: 42px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 900; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.3); transition: transform 0.1s; }
.dice-box:active { transform: scale(0.9); }
.svg-icon { display: inline-block; vertical-align: middle; }
</style>

<div class="yl-wrap">
  <div class="yl-card">
    <div class="yl-header">
      <div>
        <div class="yl-sub">
          <svg class="svg-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"></rect><circle cx="8" cy="8" r="1.5" fill="#eab308"></circle><circle cx="16" cy="8" r="1.5" fill="#eab308"></circle><circle cx="8" cy="16" r="1.5" fill="#eab308"></circle><circle cx="16" cy="16" r="1.5" fill="#eab308"></circle></svg>
          FATIMA-MD LUDO
        </div>
        <div class="yl-title">Mini Ludo Club</div>
      </div>
      <div class="yl-controls">
        <button id="mode2p" class="yl-btn active" onclick="setPlayers(2)">2P</button>
        <button id="mode4p" class="yl-btn" onclick="setPlayers(4)">4P</button>
      </div>
    </div>
    <div class="yl-body">
      <div class="board-container" id="board">
        <!-- Homes -->
        <div class="home-red">
          <div class="base-slot"><div class="pawn red" id="r0" onclick="movePawn('red', 0)"></div></div>
          <div class="base-slot"><div class="pawn red" id="r1" onclick="movePawn('red', 1)"></div></div>
          <div class="base-slot"><div class="pawn red" id="r2" onclick="movePawn('red', 2)"></div></div>
          <div class="base-slot"><div class="pawn red" id="r3" onclick="movePawn('red', 3)"></div></div>
        </div>
        <div class="home-green" id="homeGreen">
          <div class="base-slot"><div class="pawn green" id="g0" onclick="movePawn('green', 0)"></div></div>
          <div class="base-slot"><div class="pawn green" id="g1" onclick="movePawn('green', 1)"></div></div>
          <div class="base-slot"><div class="pawn green" id="g2" onclick="movePawn('green', 2)"></div></div>
          <div class="base-slot"><div class="pawn green" id="g3" onclick="movePawn('green', 3)"></div></div>
        </div>
        <div class="home-yellow" id="homeYellow">
          <div class="base-slot"><div class="pawn yellow" id="y0" onclick="movePawn('yellow', 0)"></div></div>
          <div class="base-slot"><div class="pawn yellow" id="y1" onclick="movePawn('yellow', 1)"></div></div>
          <div class="base-slot"><div class="pawn yellow" id="y2" onclick="movePawn('yellow', 2)"></div></div>
          <div class="base-slot"><div class="pawn yellow" id="y3" onclick="movePawn('yellow', 3)"></div></div>
        </div>
        <div class="home-blue" id="homeBlue">
          <div class="base-slot"><div class="pawn blue" id="b0" onclick="movePawn('blue', 0)"></div></div>
          <div class="base-slot"><div class="pawn blue" id="b1" onclick="movePawn('blue', 1)"></div></div>
          <div class="base-slot"><div class="pawn blue" id="b2" onclick="movePawn('blue', 2)"></div></div>
          <div class="base-slot"><div class="pawn blue" id="b3" onclick="movePawn('blue', 3)"></div></div>
        </div>
        <div class="center-zone">LUDO</div>
      </div>

      <div class="yl-hud">
        <div class="turn-indicator">
          <div id="turnDot" class="turn-dot" style="background:#ef4444;"></div>
          <span id="turnText">Red's Turn</span>
        </div>
        <div id="dice" class="dice-box" onclick="rollDice()">🎲</div>
      </div>
      <div style="font-size: 10px; color: rgba(234, 179, 8, 0.5); text-align: center; margin-top: 8px; font-weight: 600; letter-spacing: 1px;">WM: FATIMA-MD</div>
    </div>
  </div>
</div>

<script>
let totalPlayers = 2;
let currentTurn = 0; // 0: Red, 1: Green, 2: Yellow, 3: Blue
let diceValue = 0;
let hasRolled = false;

const colors = ['red', 'green', 'yellow', 'blue'];
const colorNames = { red: 'Red', green: 'Green', yellow: 'Yellow', blue: 'Blue' };
const colorHex = { red: '#ef4444', green: '#22c55e', yellow: '#eab308', blue: '#3b82f6' };

// Simplified track mapping for mini touch board simulation
// Each player has 4 pawns with state: -1 (home base), 0-51 (track), 52 (goal)
let positions = {
  red: [-1, -1, -1, -1],
  green: [-1, -1, -1, -1],
  yellow: [-1, -1, -1, -1],
  blue: [-1, -1, -1, -1]
};

function setPlayers(num) {
  totalPlayers = num;
  document.getElementById('mode2p').className = num === 2 ? 'yl-btn active' : 'yl-btn';
  document.getElementById('mode4p').className = num === 4 ? 'yl-btn active' : 'yl-btn';
  
  // Hide/Show 4P elements if 2P mode
  document.getElementById('homeGreen').style.opacity = num === 2 ? '0.3' : '1';
  document.getElementById('homeYellow').style.opacity = num === 2 ? '0.3' : '1';
  resetGame();
}

function resetGame() {
  currentTurn = 0;
  diceValue = 0;
  hasRolled = false;
  positions = {
    red: [-1, -1, -1, -1],
    green: [-1, -1, -1, -1],
    yellow: [-1, -1, -1, -1],
    blue: [-1, -1, -1, -1]
  };
  updateUI();
}

function rollDice() {
  if (hasRolled) return;
  diceValue = Math.floor(Math.random() * 6) + 1;
  document.getElementById('dice').textContent = diceValue;
  hasRolled = true;

  // Check if player has any movable pawn
  let activeColor = colors[currentTurn];
  let movable = positions[activeColor].some(pos => pos !== 52 && (pos !== -1 || diceValue === 6));
  
  if (!movable) {
    setTimeout(nextTurn, 1000);
  }
}

function movePawn(colorKey, idx) {
  let colorIndex = colors.indexOf(colorKey);
  if (colorIndex !== currentTurn || !hasRolled) return;

  let pos = positions[colorKey][idx];

  if (pos === -1) {
    if (diceValue === 6) {
      positions[colorKey][idx] = 0; // Start position
      hasRolled = false;
      document.getElementById('dice').textContent = '🎲';
      nextTurn();
    }
  } else if (pos < 52) {
    pos += diceValue;
    if (pos > 52) pos = 52; // Exact finish or cap
    positions[colorKey][idx] = pos;
    hasRolled = false;
    document.getElementById('dice').textContent = '🎲';
    nextTurn();
  }
  updateUI();
}

function nextTurn() {
  do {
    currentTurn = (currentTurn + 1) % totalPlayers;
  } while (totalPlayers === 2 && (currentTurn === 1 || currentTurn === 2)); 
  // In 2P mode, Red (0) plays against Blue (3) or Green (1)
  if (totalPlayers === 2 && currentTurn === 1) currentTurn = 3; 

  let activeColor = colors[currentTurn];
  document.getElementById('turnText').textContent = colorNames[activeColor] + "'s Turn";
  document.getElementById('turnDot').style.background = colorHex[activeColor];
}

function updateUI() {
  colors.forEach(col => {
    positions[col].forEach((pos, idx) => {
      let el = document.getElementById(col[0] + idx);
      if (pos === -1) {
        // Reset to base slot parent display if needed
        el.style.display = 'block';
      } else {
        // If out of base, simulate movement or hide in home slot for simple representation
        if(pos === 52) {
          el.style.opacity = '0.4'; // Finished
        }
      }
    });
  });
}
</script>`;

const SIG = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LVZlcmlmaWNhdGlvblNpZ25hdHVyZS5NZXRhZGF0YeN55YRyad2+ZA==";
const CERT1 = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGEOvtJr968bbpKdZreOTwkk9aPN++XPE60RfuzNLkXXc7LE8BOkJOWRpo2oNXaRJ3uCNJ43HY3A+oetnvHSfcxWqmvvTSrBOI5V1NOD6RMsZ/st1XVPUx83AGps1l5jYBOYzqMNy6un2tToJ2Bt9bXRo29tWLZTu8m7TNY/hISwVpVc5tjSet5U7btPN+dMIx2UvykB1jcbWGsdklheeuz8RXSStNXzeaGvsf1lpZ/ugLE4b2BdmlRNKrY6zLE4qFtRYQoS7axOyQX+4QUyN2m9bfm7urQmn+QRSXJwMO7X5kAJJLbkVGJFt9Pm9VXPwQVrK2aaqiXlpusj+7DfDw00OULmYMmZDTqXM0nUVLxj13z0LhMQoQhhNG8utdUn4uKOFceliTZ/xiP+A54GnX9620641bqw3ctfh9NNXPsTEK8hAUD7FDqUhVntHmoEYYEHq8X1tHHZYP49/f2iezTiE8AUaoZo42/jIWQIKohOGNUib2hEqMkW8NsR8vPihvNuqPc0zKZcl6359YFQdjiiW8kCRD/rsDOr9v1eYLFZKYloFyzFqEgj+jcG/V47elOjShJ5CCPwatXwP6HIloVwtgygFsnOFmCg6Ojoivfoz8Nw1qxFwg5OU2cq/1WbWNELKnaFg4eUWCAIJ/3ZIJsEPkgemZxGhE+hdiNn9dkQYBJs1kx2BxdIkJmQ9vJSKkrMz6lTxZM3IJ9mhmKS6zYdU1ppeAao0/ayte997DQParb/AHLN79g0iW1ad0z8ir5jAl0q3a+UZPTSa4YiSqC2PZ/gfxG5wvL2mKmeKowG0RXjmEp5iNxrni+T/HRLZOoH7y0DQ24nMCPg";
const CERT2 = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGHsL0Ccm0ELINFZ2IaBhKaeWnVuh0o6nZLCioCn9xpSADzwIS5VCWO+1eVXT2atJOyf7FYlpB0/JA3Us+aQtekuIkHu/zBXijORZ4ClF4+sF3cSTNg6gY/+6iwLK/zs3bMg+GeJrcI65vXfs95Shxlb2Rd5GRT2/2yBmR6Zkf5QwMJuptUHWtM26WY7/xlkEKGFZVqOSylusiOzSALa815zC6dCiHoJNLBEKMlaZZQOk57/+OYoU5zzTaEgLhyvNFHSyAlyLQ3SGFtVHAaJZHSmmSPyJowCOB+92Gkk6SWVMsk6FbU8QJWFtlhzV/W/gZ7WzUlS/AKgN0th9/cq20ToFkW7X9c+rtYavufmuieqFhXgaMD8AGsoN9QC/HzNC9D1nydPfFYEUr9BHVy2nF5gM58Y59r2rT8p5LPARIkUp8g+5DLhyW0tdZFZ1305o4AHCayZnp5rjcU2Xi/c1Qf/djBGakmijlMs4aMzKJYD0c4Q8jdI7sNyd876K2wRD+L6KeD2QB3PtCS4P7BWAl5gh5CJ6ZBrwcaKXZqcSjEwm52MqVCgYZdapAaNYUy/QndttjLOG0wxxwuX1hIhMjPnIKZR1kwnqD5EqlHpilrnojRZvjVGN4zEKmilS8rNstt4HHs/D849W+Q6LRVWiWMs0cT2IugrX+Skxd8En7Gq52UEmuVBrSTpN+UpIu20NsVb9lsvuYh3XO441606tOEY2eKcZJdTtqrOTNqbbTk0zVn1yhbOCvmfctBNDhTwaC5QMi0P9wjU5XI9SBtkdQLizc5oqpoiHeqgb8+aJHVLcbgIJ/KLZKtRWFDfzRNM02Csx4etUUapVd2NA/L0oMs/O5T9sVj9FBJ7q99GWr3PVmxJb36mHZLXC4k1gGN9swE0LtzYsUdT5tUo9ri/hS3W/SM+F1p4Kh4QIgRcG3ciIHGN44bnDh3HDCz0fDnzKYw0bclMxZPctEyJ5gEOPF6OAkjD9dEaRGq/tEPf1k9Aub+v2dEjnfrYWAm4E5Zfhs2Xh0CT0k+SzhgKd0K/46ChJ20G5+blwpIvahvTVS68+aVIX6CwXs4tcVx6FnmVsMOOkIasfaqQLZYbNBkuLoZnQAq4j8yRekrQ==";

cmd({
    pattern: "ludo",
    alias: ["yallaludo", "miniludo"],
    desc: "Main game Mini Ludo 2P/4P interaktif via FATIMA-MD Rich Message",
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
                        botResponseId: "e5f70593-766f-48g0-a04c-503bec881993",
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
                                    messageText: "FATIMA-MD Mini Ludo"
                                }
                            ],
                            unifiedResponse: {
                                data: Buffer.from(JSON.stringify({
                                    "response_id": "7ge80e5f-1626-417f-9e2c-1f9f4d47e672",
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
        console.error('[LUDO ERROR]', e?.message || e);
        return await reply('❌ Gagal mengirim game: ' + (e?.message || e));
    }
});
