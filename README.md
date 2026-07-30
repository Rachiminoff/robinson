<div align="center">

# Robinson

### typography × geometry × music

An experimental web experience inspired by **"Robinson" by Spitz (1995)**.

Rather than presenting lyrics as plain subtitles, **Robinson** treats every line as a poster—combining editorial typography, motion, and geometric composition to create a continuously evolving visual narrative.

[Live Demo](https://robinson-adsh.vercel.app/)

<br>

[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel&logoColor=white)](https://robinson-poster.vercel.app/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-Latest-0055FF?logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## Overview

Most lyric videos rely on backgrounds, illustrations, or footage.

**Robinson** explores a different question:

> **Can typography alone communicate emotion?**

The project uses nothing but text, motion, spacing, and geometric forms to transform every lyric into an editorial composition inspired by Swiss graphic design, modern motion graphics, and minimalist interfaces.

No images. No illustrations. Just typography.

---

## Features

### Editorial Composition

Every lyric is rendered using one of **10 handcrafted layout systems** rather than a single repeating template.

- Dynamic text positioning
- Oversized Japanese typography
- Split-screen layouts
- Vertical compositions
- Editorial-inspired geometric placement

Each screen is designed to feel like an individual poster.

---

### Motion Design

Instead of one generic transition, lyrics use a library of **15 animation styles**.

Animations include:

- Character reveal
- Word stagger
- Blur to focus
- Vertical wipe
- Scale and fade
- Editorial slide
- Mood-based transitions

Motion adapts to the emotional tone of each lyric while remaining synchronized with playback.

---

### Fully Customizable Reading Experience

The interface is designed to be configurable without interrupting playback.

**Languages**

- Japanese
- English
- Bilingual

**Typography**

- 16 Google Fonts
- Weight selection
- Size controls

**Animation**

- Playback speed
- Motion toggle
- Breathing effects

**Visuals**

- Metadata visibility
- Glow effects
- Background elements
- Particle system

All preferences persist automatically using **localStorage**.

---

### Interactive Controls

Keyboard shortcuts make the experience feel closer to a media player.

| Shortcut | Action |
|----------|--------|
| Space | Play / Pause |
| ← → | Previous / Next lyric |
| V | View mode |
| F | Fullscreen |
| H | Toggle metadata |
| Ctrl/Cmd + , | Settings |

Desktop controls automatically hide during playback, while mobile uses touch gestures.

---

### Dynamic Background

The background responds subtly without distracting from the typography.

Features include:

- Mouse parallax
- Animated geometric forms
- Music-reactive particles
- Smooth color transitions
- Ambient breathing effects

---

### Responsive Design

Designed for both desktop and mobile.

- Responsive layouts
- Adaptive typography
- Touch-friendly controls
- Mobile gesture support

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | Application framework |
| TypeScript 5 | Type safety |
| Tailwind CSS 4 | Styling |
| Framer Motion | Animation engine |
| Vite 7 | Development & bundling |
| Lucide React | Icons |
| Vercel | Deployment |

---

## Design Philosophy

The project is influenced by:

- Swiss International Style
- Editorial magazine layouts
- Kinetic typography
- Motion graphics
- Minimalist web experiences

Every visual decision prioritizes rhythm, spacing, and typography over decorative imagery.

---

## Project Structure

```text
src/
├── components/
├── hooks/
├── data/
├── styles/
├── utils/
└── App.tsx
```

---

## Local Development

```bash
git clone https://github.com/yourusername/robinson.git

cd robinson

npm install

npm run dev
```

---

## License

Released under the MIT License.*
