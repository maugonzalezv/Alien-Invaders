// src/index.ts
import { Game } from "./Game";

window.addEventListener("load", () => {
  const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;
  const game = new Game(canvas.width, canvas.height, ctx);

  const menu = document.getElementById("menu")!;
  const startBtn = document.getElementById("startBtn")!;
  startBtn.addEventListener("click", () => {
    menu.style.display = "none";   // Oculta el menú
    game.start();                  // Comienza el juego
  });
});
