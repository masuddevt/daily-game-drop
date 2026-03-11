const https = require("https");
const fs = require("fs");
const path = require("path");

// ─── Load existing games list ────────────────────────────────────────────────
const gamesJsonPath = path.join(__dirname, "games.json");
const games = JSON.parse(fs.readFileSync(gamesJsonPath, "utf8"));
const dayNumber = games.length + 1;

// List of game types to cycle through and avoid repeats
const gameConcepts = [
  "Snake game where the snake grows when eating food",
  "Memory card matching game with emoji pairs",
  "Whack-a-mole style click game",
  "Breakout / brick breaker game",
  "Typing speed test game",
  "Click the target reaction time game",
  "Simple Tetris-style falling blocks game",
  "Pong game against a computer opponent",
  "Number guessing game with hot/cold hints",
  "Simon says color sequence memory game",
  "Flappy bird style jump game",
  "Endless runner with obstacles",
  "Math quiz speed challenge",
  "Balloon popping game",
  "Sliding puzzle (15-puzzle)",
  "Color matching / sorting game",
  "Word scramble puzzle",
  "Maze navigation game",
  "Space shooter (asteroids style)",
  "Connect four against AI",
  "Tic tac toe against AI",
  "Minesweeper",
  "Pac-man inspired dot collecting game",
  "Gravity ball bounce game",
  "Clicker / idle game with upgrades",
  "Rock paper scissors with best of 5",
  "Wordle-style word guessing game",
  "Dodge the falling objects game",
  "Tower stacking balance game",
  "Paint / drawing mini game with challenges",
];

const concept = gameConcepts[(dayNumber - 1) % gameConcepts.length];

// ─── Prompt ───────────────────────────────────────────────────────────────────
const prompt = `Create a complete, fully playable browser game for Day ${dayNumber} of my Daily Game Drop website.

Game concept: ${concept}

Requirements:
- Single HTML file with all CSS and JavaScript inline
- Fun, polished, and complete — actually playable from start to finish
- Include a score counter where relevant
- Include a "Play Again" button after game over
- Dark theme matching a retro arcade aesthetic (#0a0a0f background, neon accents)
- Use Google Font "Press Start 2P" for headings/score, "Share Tech Mono" for body
- Show "DAY ${dayNumber}" and the game title at the top
- Mobile friendly where possible
- No external game libraries — pure HTML/CSS/JS only
- Make it genuinely fun and satisfying to play

Return ONLY the complete HTML file content, nothing else. No explanation, no markdown, no code blocks — just raw HTML starting with <!DOCTYPE html>.`;

// ─── Call Claude API ──────────────────────────────────────────────────────────
function callClaude(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    const options = {
      hostname: "api.anthropic.com",
      path: "/v1/messages",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Length": Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            reject(new Error(parsed.error.message));
          } else {
            resolve(parsed.content[0].text);
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

// ─── Extract title from HTML ──────────────────────────────────────────────────
function extractTitle(html) {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (match) return match[1].trim();
  const h1 = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  if (h1) return h1[1].replace(/<[^>]+>/g, "").trim();
  return concept.split(" ").slice(0, 4).join(" ");
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`🎮 Generating Day ${dayNumber} game: ${concept}`);

  const html = await callClaude(prompt);

  // Make sure the output starts with <!DOCTYPE html>
  const cleaned = html.trim().replace(/^```html\s*/i, "").replace(/```\s*$/, "").trim();

  // Save game file
  const gameDir = path.join(__dirname, "games", `day-${dayNumber}`);
  fs.mkdirSync(gameDir, { recursive: true });
  fs.writeFileSync(path.join(gameDir, "index.html"), cleaned, "utf8");
  console.log(`✅ Game saved to games/day-${dayNumber}/index.html`);

  // Update games.json
  const title = extractTitle(cleaned);
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  games.push({ day: dayNumber, title, date: today });
  fs.writeFileSync(gamesJsonPath, JSON.stringify(games, null, 2), "utf8");
  console.log(`✅ games.json updated — Day ${dayNumber}: "${title}"`);
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
