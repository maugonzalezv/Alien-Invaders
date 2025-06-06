# Alien Invaders

A Space Invaders-style game built with TypeScript and HTML5 Canvas.

## Project Description

This project is a modern implementation of the classic Space Invaders arcade game. I created it to practice my programming skills, particularly in TypeScript and HTML5 Canvas manipulation. The game features multiple waves of alien invaders with increasing difficulty, player lives, scoring system, and combo mechanics.

## Technologies Used

- **TypeScript** - For type-safe JavaScript programming
- **HTML5 Canvas** - For rendering the game graphics
- **ESBuild** - For bundling the TypeScript code
- **Live Server** - For local development

## Game Features

- Player-controlled spaceship that can move and shoot
- Multiple waves of aliens with increasing difficulty
- Progressive game mechanics:
  - Increasing alien speed with each wave
  - More aliens per wave
  - Aliens require more hits to destroy in later waves
- Scoring system with combo bonuses
- Lives system

## How to Run

1. Clone the repository
2. Navigate to the Game directory
3. Install dependencies with `npm install`
4. Build the project with `npm run build`
5. Start the game server with `npm start`

## Controls

- **A & D keys**: Move the player ship
- **Space**: Shoot

## Project Structure

- `src/` - TypeScript source files
  - `Game.ts` - Main game logic and loop
  - `Player.ts` - Player ship mechanics
  - `Invader.ts` - Alien invader logic
  - `Projectile.ts` - Projectile mechanics
  - `InputHandler.ts` - User input handling
  - `Utils.ts` - Constants and utility functions
- `public/` - Static assets and bundled JavaScript
  - `index.html` - Game HTML structure
  - `assets/` - Game assets

## Learning Outcomes

This project helped me improve my skills in:

- TypeScript and object-oriented programming
- Game development concepts
- HTML5 Canvas rendering
- Game physics and collision detection
- User input handling

---

_This project was created solely for educational purposes and to practice programming skills._
