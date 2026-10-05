# Architecture

## 1. The Big Picture

Robinson can be understood as five connected parts:

``` text
Song
  ↓
Audio / Playback
  ↓
Current Lyric
  ↓
Composition Generator
  ↓
Poster + Typography + Motion
```

The application keeps track of the song position. From that position it
determines the active lyric. The active lyric is then used to decide
what the screen should look like.

The visual result is rendered by React components.

------------------------------------------------------------------------

## 2. App Layer

`src/App.tsx` is the main application entry point.

It connects the major parts of the experience and provides the overall
page structure.

You normally do not need to edit this file when changing only the
poster-generation system.

------------------------------------------------------------------------

## 3. Playback Layer

`src/hooks/useAudio.ts` handles audio-related state and playback
behavior.

The important value for the visual system is the current playback time.

The visual system uses that time to determine which lyric should
currently be displayed.

------------------------------------------------------------------------

## 4. Lyric Data

Lyrics are stored in the project's data layer.

The lyric data contains timing information so that a lyric can be
associated with a section of the song.

Conceptually:

``` text
start time → lyric begins
end time   → lyric ends
text       → Japanese / English content
```

The application compares the current audio time with these ranges.

------------------------------------------------------------------------

## 5. Poster Composition

`src/components/PosterComposition.tsx` is the main coordinator for the
generated visual experience.

It is responsible for deciding things such as:

-   which lyric is active
-   whether the device is mobile
-   what visual family should be used
-   which geometric variant should be used
-   how the lyric's characteristics affect the composition
-   which deterministic seed should be used
-   when the visual composition changes

It then passes the resulting information to the poster-art component.

------------------------------------------------------------------------

## 6. Swiss Poster Art

`src/components/SwissPosterArt.tsx` contains the actual visual
composition systems.

This file contains the geometric building blocks and poster variants.

It is useful to think of this file as the project's visual library.

A composition may contain:

-   blocks
-   circles
-   rings
-   rules
-   frames
-   diagonal fields
-   cropped shapes
-   grids
-   editorial bands
-   visual counters

These elements are combined into different arrangements.

------------------------------------------------------------------------

## 7. Composition Engine

`src/engine/CompositionEngine.ts` contains logic used to create
composition information such as color and geometry decisions.

The engine helps separate visual decision-making from the React
rendering code.

This makes the system easier to expand without putting every visual rule
directly inside the JSX.

------------------------------------------------------------------------

## 8. Randomness Utility

`src/utils/seededRandom.ts` provides deterministic random helpers.

Instead of relying entirely on ordinary random numbers, the system uses
a seed.

A seed can be derived from information such as:

``` text
lyric timing
+
lyric index
+
device offset
```

This means a lyric can have a stable visual identity.

------------------------------------------------------------------------

## 9. Why the System Is Split Into Components

The project separates concerns so that each part has a clear job.

For example:

-   audio code handles audio
-   lyric data contains lyrics
-   composition code decides what to display
-   poster art draws the visual system
-   controls handle interaction
-   settings handle user preferences

This makes changes safer and makes the project easier to understand.

------------------------------------------------------------------------

## 10. Typical Flow

A normal frame of the application can be thought of like this:

``` text
Audio time changes
       ↓
Find active lyric
       ↓
Analyze lyric
       ↓
Create deterministic seed
       ↓
Choose visual direction
       ↓
Generate composition
       ↓
Render poster art
       ↓
Render lyric typography
       ↓
Animate
```

The user sees only the final result, but this sequence is what produces
it.
