// src/Player.ts
import { Game } from "./Game";
import { Projectile } from "./Projectile";

export class Player {
  x: number;
  y: number;
  width  = 60;
  height = 20;
  speed  = 300;     // px/s
  cooldown = 0;     // segundos

  constructor(private game: Game) {
    this.x = (game.width - this.width) / 2;
    this.y =  game.height - this.height - 10;
  }

  update(dt: number) {
    if (this.game.left)  this.x = Math.max(0, this.x - this.speed * dt);
    if (this.game.right) this.x = Math.min(this.game.width - this.width, this.x + this.speed * dt);

    if (this.game.shoot && this.cooldown <= 0) {
      this.game.projectiles.push(
        new Projectile(this.x + this.width/2, this.y, -500, this.game)
      );
      this.cooldown = 0.5;
    }

    this.cooldown = Math.max(0, this.cooldown - dt);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "cyan";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
