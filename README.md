# Frutasso Survivors

A browser-based survival game inspired by Vampire Survivors, built with React. Fight against waves fruit enemies with automatic projectile combat!

## Features

- **Player Character**: Tileset-based animation with directional movement
- **Combat System**: Automatic projectile firing with bright green energy shots
- **Progressive Difficulty**: 4 enemy tiers with increasing health, speed, and damage
- **Visual Effects**: Player damage flash, enhanced projectile animations, enemy health bars
- **Complete Game Flow**: Loading screens, start screen, game over popup, and restart functionality
- **Responsive Design**: Works on desktop and mobile devices
- **Damage System**: Player health, enemy health, collision detection with cooldowns

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
- **Automatic Combat**: Player automatically fires projectiles at the nearest enemy
- **Goal**: Survive as long as possible while enemies spawn and chase you

## Game Mechanics

- **Enemy Tiers**: 
  - Tier 1 (0-30s): Basic fruits (🍓) - 1 health, slow speed
  - Tier 2 (30-60s): Medium fruits (🍎) - 2 health, faster speed
  - Tier 3 (60-90s): Strong fruits (🍊) - 3 health, even faster
  - Tier 4 (90s+): Elite fruits (🍌) - 4 health, fastest speed
- **Player Health**: 100 HP with 1-second damage cooldown
- **Scoring**: Points awarded based on enemy tier (10/20/30/40 points)
- **Fire Rate**: Projectiles fire every 500ms at the nearest enemy

## Completed Features

- ✅ Weapons and combat system
- ✅ Multiple enemy types with progressive difficulty
- ✅ Visual effects and animations
- ✅ Complete game flow with loading screens
- ✅ Game over system with score tracking
- ✅ Responsive design

## Future Improvements

- Experience points and leveling system
- Power-ups and upgrades
- Sound effects and background music
- Boss battles
- Procedural map generation
- Weapon variety and upgrades
- Achievement system

## Project Structure

```
src/
├── components/
│   ├── Player.js           # Player character component with animation
│   ├── Player.css          # Player styling and tileset animation
│   ├── Enemy.js            # Enemy component with health bars
│   ├── Enemy.css           # Enemy styling and tier effects
│   ├── Projectile.js       # Energy projectile component
│   ├── Projectile.css      # Projectile visual effects and animations
│   ├── StartScreen.js      # Game start screen component
│   ├── StartScreen.css     # Start screen styling
│   ├── StartButton.js      # Start game button component
│   ├── StartButton.css     # Start button styling
│   ├── LoadingScreen.js    # Loading screen with player animation
│   ├── LoadingScreen.css   # Loading screen styling
│   ├── GameOver.js         # Game over popup component
│   └── GameOver.css        # Game over popup styling
├── assets/
│   ├── player.png          # Player character sprite sheet
│   ├── background.png      # Start screen background
│   ├── title.png           # Game title image
│   └── map.png             # Game world background
├── App.js                  # Main app component with game state management
├── Game.js                 # Core game logic, combat system, and state
├── Game.css                # Game area styling and UI
├── index.js                # React entry point
└── index.css               # Global styles and pixel art rendering
```

## Technical Details

- **Framework**: React 18 with functional components and hooks
- **Styling**: CSS with pixel art rendering optimizations
- **Animation**: CSS animations and React state-based sprite animation
- **Game Loop**: RequestAnimationFrame for 60 FPS performance
- **State Management**: React useState and useEffect hooks
- **Responsive**: Mobile-friendly with viewport-based scaling
- **Font**: "Press Start 2P" for authentic pixel art aesthetic