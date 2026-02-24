# Partixel

## Demo

![Demo](sample_tiny.gif)

Watch particles animate from random positions to form a coherent image, demonstrating the physics simulation and interactive capabilities.

## Why This Project
Partixel was created to transform ordinary images into mesmerizing interactive particle halftone formations. Traditional image filters can be static and predictable—this project brings photos to life with dynamic particle physics, creating an engaging visual experience where pixels react to mouse interaction and animate into formation. Whether for artistic expression, creative portfolios, or unique social media content, Partixel makes it easy to generate stunning visual effects and export them as images or video recordings.

## Standout Features
- **Interactive Particle Halftone**: Images rendered as dynamic particles that respond to mouse movement
- **Mouse Physics**: Particles repel from cursor with adjustable strength and radius
- **Formation Animation**: Watch particles animate into the final image formation
- **Real-time Controls**: Adjust particle size, contrast, accent colors, physics parameters
- **Accent Color System**: Random accent particles with customizable probability and color
- **Size Variation**: Particles vary in size for organic, textured appearance
- **Video Recording**: Capture the formation animation as WebM video
- **Image Export**: Download the final rendered canvas as PNG
- **Responsive Design**: Works seamlessly across different screen sizes
- **Dark Theme**: Beautiful dark UI optimized for creative work

## Tech Stack
- [Next.js 15](https://nextjs.org/) - React framework with App Router
- [React 19](https://reactjs.org/) - UI library
- [TypeScript](https://www.typescript.org/) - Type safety
- [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first styling
- [HTML5 Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) - High-performance particle rendering
- [Radix UI](https://www.radix-ui.com/) - Accessible component primitives
- [Vercel Analytics](https://vercel.com/analytics) - Web analytics
- [Lucide React](https://lucide.dev/) - Beautiful icons

## Architecture (Essential)
```
Partixel/
├── app/
│   ├── globals.css          # Global styles and Tailwind config
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Main application page
├── components/
│   ├── effect-controls.tsx  # Parameter adjustment panel
│   ├── image-canvas.tsx     # Canvas rendering engine
│   ├── image-uploader.tsx   # Drag-drop image upload
│   ├── theme-provider.tsx   # Dark mode provider
│   └── ui/                  # Reusable UI components
├── hooks/
│   ├── use-mobile.ts        # Mobile detection hook
│   └── use-toast.ts         # Toast notifications
├── lib/
│   ├── noise.ts             # Noise generation utilities
│   └── utils.ts             # Utility functions
├── public/
│   └── IMG_0136.jpg         # Default sample image
├── styles/
│   └── globals.css          # Additional styles
├── next.config.mjs          # Next.js configuration
├── package.json             # Dependencies
└── tsconfig.json            # TypeScript configuration
```

## Quick Run

### Option 1: Live Demo
Visit [partixel.vercel.app](https://partixel.vercel.app) to try the app instantly.

### Option 2: Local Development

1. Clone & install
```bash
git clone https://github.com/freyzo/Partixel.git
cd Partixel
npm install
```

2. Run the app
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

No API keys or setup required - works out of the box with default sample image.

## Usage

### Image Upload
- Drag and drop any image onto the upload area
- Or click "Upload New Image" to select from file picker

### Effect Controls
- **Halftone Size**: Controls the base size of particles
- **Contrast**: Adjusts brightness mapping to particle size
- **Accent Color**: Choose the accent particle color
- **Mouse Radius**: How far particles react to cursor
- **Repulsion Strength**: How strongly particles push away from cursor
- **Return Speed**: How quickly particles return to original position
- **Accent Probability**: Chance of a particle becoming an accent color
- **Size Variation**: Random size variance for organic texture

### Export Options
- **Download Image**: Save the current canvas as PNG
- **Replay**: Watch the formation animation again
- **Record Video**: Capture the 8-second formation animation as WebM

## Roadmap

- [ ] Particle turbulence/noise effects
- [ ] Custom particle shapes
- [ ] Additional export formats (GIF, MP4)
- [ ] Preset configurations
- [ ] Batch processing multiple images

## About

Created by [@freyazou](https://github.com/freyazou)

