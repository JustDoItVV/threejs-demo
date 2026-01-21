# Three.js Demo

Interactive 3D web experiences built with Three.js, React Three Fiber, and Next.js.

## Demo Projects

### Blockchain City
Interactive 3D blockchain visualization where each block becomes a building in a growing city. Features real-time mining, transaction particles, and clickable block exploration.

### Rogue
Classic turn-based roguelike dungeon crawler with 10 procedurally generated levels, inventory system, character progression, and save/load functionality.

### Froggy Road
Crossy Road clone with isometric camera, procedural lane generation, Object Pool optimization, and post-processing effects.

### 3D Model Viewer
Multi-format model viewer (GLB, GLTF, FBX, OBJ) with material customization, dual camera modes, texture upload, and 12 default models.

### Animated Scene
Custom GLSL shaders on animated TorusKnot geometry with 3000-particle system and color gradients.

## Tech Stack

- **Framework**: Next.js (App Router)
- **3D Graphics**: Three.js, React Three Fiber, Drei
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: Zustand
- **Language**: TypeScript

## Getting Started

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                   # Next.js App Router pages
├── components/            # React components
├── threejs-apps/          # Individual 3D demo applications
│   ├── blockchain-city/
│   ├── rogue/
│   ├── froggy-road/
│   ├── 3d-model-viewer/
│   └── animated-scene/
└── libs/                  # Shared utilities
```

## License

MIT
