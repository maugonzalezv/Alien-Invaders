// src/InputHandler.ts
import { Game } from "./Game";

export class InputHandler {
  constructor(private game: Game) {
    window.addEventListener("keydown", e => this.keyDown(e));
    window.addEventListener("keyup",   e => this.keyUp(e));
  }

  private keyDown(e: KeyboardEvent) {
    switch (e.code) {
      case "KeyA":      // tecla A para mover a la izquierda
        this.game.left = true;
        break;
      case "KeyD":      // tecla D para mover a la derecha
        this.game.right = true;
        break;
      case "Space":     // espacio para disparar (igual que antes)
        this.game.shoot = true;
        break;
    }
  }

  private keyUp(e: KeyboardEvent) {
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
}
