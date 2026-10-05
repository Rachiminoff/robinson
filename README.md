# Robinson

### Typography × Geometry × Music

**Robinson** is an experimental lyric-video web experience inspired by
the visual language of Swiss International Typographic Style, Bauhaus,
editorial design, and kinetic typography.

Instead of treating lyrics as subtitles placed on top of a background,
Robinson treats each lyric line as a small visual poster. The text,
geometric forms, color, spacing, and motion are designed to work
together as one composition.

> The goal is simple: every lyric should feel like a different piece of
> graphic design while still belonging to the same visual system.

------------------------------------------------------------------------

## What Robinson Does

Robinson plays a song while displaying synchronized Japanese and English
lyrics.

As the song progresses, the application:

1.  Determines which lyric is currently active.
2.  Reads basic information about that lyric, such as its length, word
    count, repetition, punctuation, and timing.
3.  Uses that information to influence the visual direction.
4.  Generates a deterministic visual composition for the lyric.
5.  Selects colors, geometric structures, layout variations, and
    typography treatment.
6.  Animates the composition into view.
7.  Keeps the result readable on the current device.

The result is a lyric video that behaves more like a sequence of
animated posters than a traditional subtitle player.

------------------------------------------------------------------------

## Main Features

### Generative Poster Composition

The visual system can select from multiple visual families, geometric
variants, layout structures, and color combinations.

The important idea is that variety is not produced only by changing
colors. The position, scale, hierarchy, cropping, and relationship
between shapes also change.

### Swiss / Bauhaus-Inspired Art Direction

The visual language uses ideas such as:

-   strong grids
-   asymmetric alignment
-   large typography
-   geometric forms
-   cropped shapes
-   editorial spacing
-   primary and secondary color fields
-   negative space
-   registration-style details
-   visual tension between large and small elements

The design is inspired by these traditions rather than attempting to
reproduce one historical poster exactly.

### Lyric-Aware Visuals

Lyrics are not treated as identical pieces of text.

The system can consider properties such as:

-   Japanese character count
-   English text length
-   word count
-   duration
-   text density
-   repetition
-   punctuation
-   question marks
-   short or long lines
-   quiet or dramatic sections

These properties help guide the choice of visual direction.

### Desktop and Mobile Compositions

Desktop and mobile use different composition seeds and visual choices.

This is intentional. Mobile is not simply a smaller desktop poster. The
system gives each device class its own visual variation so that the
composition can be designed for the available screen space.

### Deterministic Randomness

Robinson uses seeded randomness.

In simple terms, this means the application can make something look
random while still producing the same result from the same seed.

This is useful because:

-   the same lyric can reproduce its composition
-   visual changes do not become completely unpredictable
-   different lyrics can receive different compositions
-   desktop and mobile can have different results
-   debugging is easier

------------------------------------------------------------------------

## User Experience

### Playback

The application synchronizes visual changes with the song timeline.

The active lyric changes as playback moves through the lyric data.

### Controls

The project includes playback, view, fullscreen, metadata, settings, and
navigation controls.

Keyboard and touch interaction are supported where appropriate for the
device.

### Settings

The application includes options for the reading and visual experience,
including language, typography, animation, and visual preferences.

User preferences can be stored locally so that the experience can
remember settings between sessions.

------------------------------------------------------------------------

## Technology

  Technology      Purpose
  --------------- -----------------------------------------
  React           User interface and component system
  TypeScript      Typed application code
  Framer Motion   Animation and transitions
  Tailwind CSS    Utility-based styling
  Vite            Development server and production build
  Lucide React    Interface icons
  Vercel          Deployment

------------------------------------------------------------------------

## Important Files

``` text
src/
├── App.tsx
├── components/
│   ├── PosterComposition.tsx
│   ├── SwissPosterArt.tsx
│   ├── Controls.tsx
│   ├── Timeline.tsx
│   ├── SettingsPanel.tsx
│   └── ...
├── config/
│   └── composition.ts
├── data/
│   ├── lyrics.ts
│   └── metadata.json
├── engine/
│   └── CompositionEngine.ts
├── hooks/
│   ├── useAudio.ts
│   ├── useMouseTracking.ts
│   └── useParallax.ts
└── utils/
    └── seededRandom.ts
```

For a plain-language explanation of the architecture, see
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

For the visual generation system, see
[`docs/GENERATIVE-COMPOSITION.md`](docs/GENERATIVE-COMPOSITION.md).

For development and troubleshooting, see
[`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md).

------------------------------------------------------------------------

## Running the Project

Install dependencies:

``` bash
npm install
```

Start the development server:

``` bash
npm run dev
```

Create a production build:

``` bash
npm run build
```

Run the project locally before deploying whenever possible. This catches
TypeScript and build errors before they reach Vercel.

------------------------------------------------------------------------

## Deployment

Robinson can be deployed to Vercel.

The usual workflow is:

``` bash
git add .
git commit -m "Describe the change"
git push
```

Vercel can then build and deploy the pushed project.

If a deployment fails, read the first TypeScript or ESLint error in the
build output. Warnings, such as Node deprecation warnings, are normally
not the reason a build stopped.

------------------------------------------------------------------------

## Design Principle

Robinson should feel designed rather than randomly decorated.

When adding or changing a visual composition, prioritize:

1.  hierarchy
2.  readability
3.  spatial balance
4.  meaningful shape relationships
5.  color contrast
6.  variation between lyrics
7.  smooth motion

Avoid adding shapes simply to fill empty space. A shape should have a
reason to exist in the composition.

------------------------------------------------------------------------

## Documentation

The `docs/` folder contains the project documentation:

-   `ARCHITECTURE.md` --- how the application is organized
-   `GENERATIVE-COMPOSITION.md` --- how lyric-driven visual generation
    works
-   `VISUAL-SYSTEM.md` --- design rules and visual principles
-   `DEVELOPMENT.md` --- setup, editing, testing, and troubleshooting
-   `LYRICS-AND-DATA.md` --- how lyric data is used
-   `MAINTENANCE.md` --- practical guidance for safely changing the
    project

------------------------------------------------------------------------

## License

Released under the MIT License.
