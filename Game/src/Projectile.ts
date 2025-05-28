// src/Projectile.ts
import { Game } from "./Game";
import { COLOR_PROJECTILE } from "./Utils";

export class Projectile {
  x: number;
  y: number;
  width  = 4;
  height = 10;
  vy: number;
  game: Game;

  constructor(x: number, y: number, vy: number, game: Game) {
    this.x = x - this.width / 2;
    this.y = y;
    this.vy = vy;
    this.game = game;
  }

  update(dt: number) {
    this.y += this.vy * dt;

    // Si sale de pantalla
    if (this.y + this.height < 0) {
      // bala del jugador falló
      this.game.registerMiss();
      this.game.projectiles = this.game.projectiles.filter(p => p !== this);
      return;
    }
    if (this.y > this.game.height) {
      // bala enemiga pasó de largo
      this.game.projectiles = this.game.projectiles.filter(p => p !== this);
      return;
    }

    // Colisión con invaders (sólo si va hacia arriba)
    if (this.vy < 0) {
      this.game.invaders.forEach(inv => {
        if (this.collides(inv)) {
          this.game.registerHit();
          this.game.invaders = this.game.invaders.filter(i => i !== inv);
          this.game.projectiles = this.game.projectiles.filter(p => p !== this);
        }
      });
    }

    // Colisión con jugador (sólo si vy > 0)
    if (this.vy > 0 && this.collides(this.game.player)) {
      this.game.loseLife();
      this.game.projectiles = this.game.projectiles.filter(p => p !== this);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = COLOR_PROJECTILE;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  private collides(target: { x: number; y: number; width: number; height: number }) {
    return (
      this.x < target.x + target.width &&
      this.x + this.width > target.x &&
      this.y < target.y + target.height &&
      this.y + this.height > target.y
    );
  }
}
