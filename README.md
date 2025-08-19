# Frutasso Survivors

A simple browser-based game inspired by Vampire Survivors, built with React.

## Features

- Player character with tileset-based animation
- WASD/Arrow key movement
- Enemy spawning and AI
- Basic game loop and UI

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. The player tileset (`player.png`) is already configured in the assets folder

3. Start the development server:
   ```
   npm start
   ```

## Controls

- **WASD** or **Arrow Keys**: Move player
- The goal is to survive as long as possible while enemies spawn and chase you

## Future Improvements

- Weapons and combat system (✅)
- Experience points and leveling
- Power-ups and upgrades
- Better graphics and sound effects
- Multiple enemy types
- Boss battles
- Procedural map generation

## Project Structure

```
src/
├── components/
│   ├── Player.js       # Player character component
│   ├── Player.css      # Player styling and tileset animation
│   ├── Enemy.js        # Enemy component
│   └── Enemy.css       # Enemy styling
├── assets/
│   ├── create-tileset.html    # Tool to generate player tileset
│   └── player-tileset.png     # Player character sprite sheet
├── Game.js             # Main game logic and state
├── Game.css            # Game area styling
└── index.js            # React entry point
```