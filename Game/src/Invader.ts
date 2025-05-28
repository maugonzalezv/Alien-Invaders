// src/Invader.ts
import { Game } from "./Game";
import { Projectile } from "./Projectile";

export class Invader {
  // Tamaño fijo de cada invader
  static width  = 40;
  static height = 30;

  // Instancia expone width/height para colisiones
  width  = Invader.width;
  height = Invader.height;

  x: number;
  y: number;
  dir = 1;            // 1 = derecha, -1 = izquierda
  speed: number;      // velocidad en px/s, recibida en el constructor
  hitsRemaining: number; // cuántos impactos aguanta
  color: string;      // color de dibujo
  private game: Game;

  constructor(
    x: number,
    y: number,
    hits: number,
    speed: number,
    color: string,
    game: Game
  ) {
    this.x = x;
    this.y = y;
    this.hitsRemaining = hits;
    this.speed = speed;
    this.color = color;
    this.game = game;
  }

  update(dt: number) {
    // Movimiento horizontal y rebote
    this.x += this.speed * this.dir * dt;
    if (this.x < 0 || this.x + this.width > this.game.width) {
      this.dir *= -1;
      this.y += this.height / 2;
    }

    // Disparo aleatorio hacia abajo
    if (Math.random() < 0.001) {
      this.game.projectiles.push(
        new Projectile(
          this.x + this.width / 2,
          this.y + this.height,
          200,       // velocidad vy positiva
          this.game
        )
      );
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Dibuja el invader
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // (Opcional) dibuja cuántos impactos le quedan
    ctx.fillStyle = "black";
    ctx.font = "12px sans-serif";
    ctx.fillText(
      String(this.hitsRemaining),
      this.x + this.width / 2 - 6,
      this.y + this.height / 2 + 4
    );
  }
}
