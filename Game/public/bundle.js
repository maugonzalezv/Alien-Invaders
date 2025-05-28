"use strict";
(() => {
  // src/InputHandler.ts
  var InputHandler = class {
    constructor(game) {
      this.game = game;
      window.addEventListener("keydown", (e) => this.keyDown(e));
      window.addEventListener("keyup", (e) => this.keyUp(e));
    }
    keyDown(e) {
      switch (e.code) {
        case "KeyA":
          this.game.left = true;
          break;
        case "KeyD":
          this.game.right = true;
          break;
        case "Space":
          this.game.shoot = true;
          break;
      }
    }
    keyUp(e) {
      switch (e.code) {
        case "KeyA":
          this.game.left = false;
          break;
        case "KeyD":
          this.game.right = false;
          break;
        case "Space":
          this.game.shoot = false;
          break;
      }
    }
  };

  // src/Utils.ts
  var COLOR_BG = "#111";
  var COLOR_TEXT = "white";
  var COLOR_PROJECTILE = "white";
  var INVADER_BASE_SPEED = 50;
  var INVADER_SPEED_STEP = 10;
  var INVADER_BASE_HITS = 1;
  var INVADER_HITS_STEP = 1;
  var INVADER_PADDING = 20;
  var INVADER_ROWS = 3;
  var INVADER_COLS = 10;
  var TOTAL_WAVES = 10;
  var WAVE_COLORS = [
    "lime",
    "cyan",
    "yellow",
    "orange",
    "red",
    "magenta",
    "blue",
    "white",
    "grey",
    "brown"
  ];
  var BASE_POINTS = 10;
  var BONUS_POINTS = 5;
  var COMBO_THRESHOLD = 5;

  // src/Projectile.ts
  var Projectile = class {
    constructor(x, y, vy, game) {
      this.width = 4;
      this.height = 10;
      this.x = x - this.width / 2;
      this.y = y;
      this.vy = vy;
      this.game = game;
    }
    update(dt) {
      this.y += this.vy * dt;
      if (this.y + this.height < 0) {
        this.game.registerMiss();
        this.game.projectiles = this.game.projectiles.filter((p) => p !== this);
        return;
      }
      if (this.y > this.game.height) {
        this.game.projectiles = this.game.projectiles.filter((p) => p !== this);
        return;
      }
      if (this.vy < 0) {
        this.game.invaders.forEach((inv) => {
          if (this.collides(inv)) {
            this.game.registerHit();
            this.game.invaders = this.game.invaders.filter((i) => i !== inv);
            this.game.projectiles = this.game.projectiles.filter((p) => p !== this);
          }
        });
      }
      if (this.vy > 0 && this.collides(this.game.player)) {
        this.game.loseLife();
        this.game.projectiles = this.game.projectiles.filter((p) => p !== this);
      }
    }
    draw(ctx) {
      ctx.fillStyle = COLOR_PROJECTILE;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    collides(target) {
      return this.x < target.x + target.width && this.x + this.width > target.x && this.y < target.y + target.height && this.y + this.height > target.y;
    }
  };

  // src/Player.ts
  var Player = class {
    // segundos
    constructor(game) {
      this.game = game;
      this.width = 60;
      this.height = 20;
      this.speed = 300;
      // px/s
      this.cooldown = 0;
      this.x = (game.width - this.width) / 2;
      this.y = game.height - this.height - 10;
    }
    update(dt) {
      if (this.game.left) this.x = Math.max(0, this.x - this.speed * dt);
      if (this.game.right) this.x = Math.min(this.game.width - this.width, this.x + this.speed * dt);
      if (this.game.shoot && this.cooldown <= 0) {
        this.game.projectiles.push(
          new Projectile(this.x + this.width / 2, this.y, -500, this.game)
        );
        this.cooldown = 0.5;
      }
      this.cooldown = Math.max(0, this.cooldown - dt);
    }
    draw(ctx) {
      ctx.fillStyle = "cyan";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  };

  // src/Invader.ts
  var Invader = class _Invader {
    constructor(x, y, hits, speed, color, game) {
      // Instancia expone width/height para colisiones
      this.width = _Invader.width;
      this.height = _Invader.height;
      this.dir = 1;
      this.x = x;
      this.y = y;
      this.hitsRemaining = hits;
      this.speed = speed;
      this.color = color;
      this.game = game;
    }
    static {
      // Tamaño fijo de cada invader
      this.width = 40;
    }
    static {
      this.height = 30;
    }
    update(dt) {
      this.x += this.speed * this.dir * dt;
      if (this.x < 0 || this.x + this.width > this.game.width) {
        this.dir *= -1;
        this.y += this.height / 2;
      }
      if (Math.random() < 1e-3) {
        this.game.projectiles.push(
          new Projectile(
            this.x + this.width / 2,
            this.y + this.height,
            200,
            // velocidad vy positiva
            this.game
          )
        );
      }
    }
    draw(ctx) {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.fillStyle = "black";
      ctx.font = "12px sans-serif";
      ctx.fillText(
        String(this.hitsRemaining),
        this.x + this.width / 2 - 6,
        this.y + this.height / 2 + 4
      );
    }
  };

  // src/Game.ts
  var Game = class {
    constructor(width, height, ctx) {
      this.width = width;
      this.height = height;
      this.ctx = ctx;
      this.left = false;
      this.right = false;
      this.shoot = false;
      this.invaders = [];
      this.projectiles = [];
      this.score = 0;
      this.consecutiveHits = 0;
      this.lives = 3;
      this.gameOver = false;
      this.victory = false;
      this.waveIndex = 0;
      this.lastTime = 0;
      this.player = new Player(this);
      new InputHandler(this);
      this.spawnWave();
    }
    /** Impactos por invader: ronda1–2→1, ronda3→2, ronda4→3, etc. */
    hitsForWave() {
      return Math.max(1, this.waveIndex);
    }
    /** Velocidad por invader: base + paso*ronda */
    speedForWave() {
      return INVADER_BASE_SPEED + this.waveIndex * INVADER_SPEED_STEP;
    }
    /**
     * Genera INVADER_ROWS filas y (INVADER_COLS + waveIndex) columnas
     * sin aleatoriedad para garantizar repoblación.
     */
    spawnWave() {
      this.invaders = [];
      const hits = INVADER_BASE_HITS + this.waveIndex * INVADER_HITS_STEP;
      const speed = this.speedForWave();
      const color = WAVE_COLORS[this.waveIndex];
      const rows = INVADER_ROWS;
      const cols = INVADER_COLS + this.waveIndex;
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
    animate(ts) {
      const dt = (ts - this.lastTime) / 1e3;
      this.lastTime = ts;
      this.ctx.fillStyle = COLOR_BG;
      this.ctx.fillRect(0, 0, this.width, this.height);
      this.player.update(dt);
      this.player.draw(this.ctx);
      this.invaders.forEach((i) => {
        i.update(dt);
        i.draw(this.ctx);
      });
      this.projectiles.forEach((p) => {
        p.update(dt);
        p.draw(this.ctx);
      });
      this.ctx.fillStyle = COLOR_TEXT;
      this.ctx.font = "20px sans-serif";
      this.ctx.fillText(`Score: ${this.score}`, 20, 30);
      this.ctx.fillText(`Wave: ${this.waveIndex + 1}/${TOTAL_WAVES}`, 20, 60);
      for (let i = 0; i < this.lives; i++) {
        this.ctx.fillText("\u2665", this.width - 30 - i * 20, 30);
      }
      if (this.gameOver) {
        this.drawEnd("Game Over");
        return;
      }
      if (this.invaders.length === 0) {
        this.waveIndex++;
        if (this.waveIndex < TOTAL_WAVES) {
          this.spawnWave();
        } else {
          this.victory = true;
        }
      }
      if (this.victory) {
        this.drawEnd("\xA1Felicidades, ganaste!");
        return;
      }
      requestAnimationFrame(this.animate.bind(this));
    }
    drawEnd(msg) {
      this.ctx.fillStyle = COLOR_TEXT;
      this.ctx.font = "48px sans-serif";
      this.ctx.fillText(msg, this.width / 2 - 200, this.height / 2);
      this.ctx.font = "24px sans-serif";
      this.ctx.fillText(`Score: ${this.score}`, this.width / 2 - 70, this.height / 2 + 40);
    }
    // Métodos de puntuación y vidas
    registerHit() {
      this.consecutiveHits++;
      const extra = this.consecutiveHits >= COMBO_THRESHOLD ? BONUS_POINTS : 0;
      this.score += BASE_POINTS + extra;
    }
    registerMiss() {
      this.consecutiveHits = 0;
    }
    loseLife() {
      this.lives--;
      if (this.lives <= 0) this.gameOver = true;
    }
  };

  // src/index.ts
  window.addEventListener("load", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const game = new Game(canvas.width, canvas.height, ctx);
    const menu = document.getElementById("menu");
    const startBtn = document.getElementById("startBtn");
    startBtn.addEventListener("click", () => {
      menu.style.display = "none";
      game.start();
    });
  });
})();
//# sourceMappingURL=bundle.js.map
