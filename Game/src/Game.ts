// src/Game.ts
import { InputHandler }   from "./InputHandler";
import { Player }         from "./Player";
import { Invader }        from "./Invader";
import { Projectile }     from "./Projectile";
import {
  COLOR_BG, COLOR_TEXT,
  INVADER_BASE_SPEED, INVADER_SPEED_STEP,
  INVADER_BASE_HITS,  INVADER_HITS_STEP,
  INVADER_PADDING,
  INVADER_ROWS, INVADER_COLS,
  WAVE_COLORS, TOTAL_WAVES,
  BASE_POINTS, BONUS_POINTS, COMBO_THRESHOLD
} from "./Utils";

export class Game {
  left = false;
  right = false;
  shoot = false;

  player: Player;
  invaders: Invader[]     = [];
  projectiles: Projectile[]= [];

  score = 0;
  consecutiveHits = 0;
  lives = 3;
  gameOver = false;
  victory  = false;

  private waveIndex = 0;
  private lastTime = 0;

  constructor(
    public width: number,
    public height: number,
    public ctx: CanvasRenderingContext2D
  ) {
    this.player = new Player(this);
    new InputHandler(this);
    this.spawnWave();
  }

  /** Impactos por invader: ronda1–2→1, ronda3→2, ronda4→3, etc. */
  private hitsForWave(): number {
    return Math.max(1, this.waveIndex);
  }

  /** Velocidad por invader: base + paso*ronda */
  private speedForWave(): number {
    return INVADER_BASE_SPEED + this.waveIndex * INVADER_SPEED_STEP;
  }

  /**
   * Genera INVADER_ROWS filas y (INVADER_COLS + waveIndex) columnas
   * sin aleatoriedad para garantizar repoblación.
   */
  private spawnWave() {
    this.invaders = [];
    const hits  = INVADER_BASE_HITS + this.waveIndex * INVADER_HITS_STEP;
    const speed = this.speedForWave();
    const color = WAVE_COLORS[this.waveIndex];
    const rows  = INVADER_ROWS;
    const cols  = INVADER_COLS + this.waveIndex; // +1 columna cada ronda

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * (Invader.width + INVADER_PADDING);
        const y = 50 + row * (Invader.height + INVADER_PADDING);
        this.invaders.push(
          new Invader(x, y, hits, speed, color, this)
        );
      }
    }
  }

  start() {
    this.lastTime = performance.now();
    requestAnimationFrame(this.animate.bind(this));
  }

  private animate(ts: number) {
    const dt = (ts - this.lastTime) / 1000;
    this.lastTime = ts;

    // Limpia el canvas
    this.ctx.fillStyle = COLOR_BG;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Actualiza y dibuja jugador
    this.player.update(dt);
    this.player.draw(this.ctx);

    // Actualiza y dibuja invaders y proyectiles
    this.invaders.forEach(i => { i.update(dt); i.draw(this.ctx); });
    this.projectiles.forEach(p => { p.update(dt); p.draw(this.ctx); });

    // HUD: puntuación, ronda y vidas
    this.ctx.fillStyle = COLOR_TEXT;
    this.ctx.font = "20px sans-serif";
    this.ctx.fillText(`Score: ${this.score}`, 20, 30);
    this.ctx.fillText(`Wave: ${this.waveIndex + 1}/${TOTAL_WAVES}`, 20, 60);
    for (let i = 0; i < this.lives; i++) {
      this.ctx.fillText("♥", this.width - 30 - i * 20, 30);
    }

    // Game Over
    if (this.gameOver) {
      this.drawEnd("Game Over");
      return;
    }

    // Si limpiaste la oleada, pasa a la siguiente o victoria
    if (this.invaders.length === 0) {
      this.waveIndex++;
      if (this.waveIndex < TOTAL_WAVES) {
        this.spawnWave();
      } else {
        this.victory = true;
      }
    }

    // Victory
    if (this.victory) {
      this.drawEnd("¡Felicidades, ganaste!");
      return;
    }

    requestAnimationFrame(this.animate.bind(this));
  }

  private drawEnd(msg: string) {
    this.ctx.fillStyle = COLOR_TEXT;
    this.ctx.font = "48px sans-serif";
    this.ctx.fillText(msg, this.width / 2 - 200, this.height / 2);
    this.ctx.font = "24px sans-serif";
    this.ctx.fillText(`Score: ${this.score}`, this.width / 2 - 70, this.height / 2 + 40);
  }

  // Métodos de puntuación y vidas

  public registerHit() {
    this.consecutiveHits++;
    const extra = this.consecutiveHits >= COMBO_THRESHOLD ? BONUS_POINTS : 0;
    this.score += BASE_POINTS + extra;
  }

  public registerMiss() {
    this.consecutiveHits = 0;
  }

  public loseLife() {
    this.lives--;
    if (this.lives <= 0) this.gameOver = true;
  }
}
