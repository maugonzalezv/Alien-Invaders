// src/Utils.ts

// Colores generales
export const COLOR_BG         = "#111";
export const COLOR_TEXT       = "white";
export const COLOR_PROJECTILE = "white";
export const COLOR_PLAYER     = "cyan";

// Tamaño del canvas
export const CANVAS_WIDTH     = 800;
export const CANVAS_HEIGHT    = 600;

// Parámetros del jugador
export const PLAYER_SPEED     = 300;  // px/s
export const SHOOT_COOLDOWN   = 0.5;  // segundos

// Escalado de invaders por ronda
export const INVADER_BASE_SPEED = 50;  // px/s en ronda 1
export const INVADER_SPEED_STEP = 10;  // px/s adicionales cada ronda
export const INVADER_BASE_HITS  = 1;   // golpes en ronda 1
export const INVADER_HITS_STEP  = 1;   // golpes adicionales cada ronda
export const INVADER_PADDING    = 20;  // separación

// Configuración de olas
export const INVADER_ROWS      = 3;    // filas
export const INVADER_COLS      = 10;   // columnas
export const TOTAL_WAVES       = 10;   // número total de rondas

// Colores por ola
export const WAVE_COLORS = [
  "lime", "cyan", "yellow", "orange", "red",
  "magenta", "blue", "white", "grey", "brown"
];

// Puntuación y combo
export const BASE_POINTS       = 10;
export const BONUS_POINTS      = 5;
export const COMBO_THRESHOLD   = 5;
