# Development Guide

## Requirements

You should have a current Node.js installation and npm available.

Check:

``` bash
node --version
npm --version
```

------------------------------------------------------------------------

## Install

From the project directory:

``` bash
npm install
```

------------------------------------------------------------------------

## Run Locally

Start the development server:

``` bash
npm run dev
```

Open the local address printed by Vite.

------------------------------------------------------------------------

## Production Build

Before pushing a change:

``` bash
npm run build
```

The production build is important because development mode may be more
forgiving than the production compiler.

------------------------------------------------------------------------

## Understanding Build Errors

Read the actual compiler error before changing code.

For example:

``` text
TS2304: Cannot find name 'index'
```

means TypeScript cannot see a variable called `index` in that scope.

A warning such as:

``` text
DeprecationWarning
```

is not automatically a build failure.

Focus on the first `ERROR` or `TSxxxx` message.

------------------------------------------------------------------------

## Common TypeScript Problems

### Variable Scope

If a variable is declared inside a function or `useMemo`, it cannot
normally be used outside that block.

For example:

``` ts
useMemo(() => {
  const index = currentLyric.index;
}, []);
```

does not make `index` available to JSX outside the callback.

If JSX needs the value, place the declaration at component scope:

``` ts
const index = currentLyric?.index ?? 0;
```

------------------------------------------------------------------------

### JSX Helper Functions

Functions such as:

``` ts
square(...)
circle(...)
frame(...)
```

are JavaScript functions.

They are not HTML elements.

Do not write:

``` tsx
<square />
```

unless `square` is actually a React component.

Instead use:

``` tsx
{square(...)}
```

when inside JSX.

When building an ordinary JavaScript array outside JSX, use:

``` ts
square(...)
```

without JSX braces.

------------------------------------------------------------------------

### Unused Variables

The production lint step may reject variables that are created but never
used.

If a variable is unnecessary, remove it.

If it is required, make sure it is actually used.

Do not silence lint errors simply to make the build pass unless there is
a good reason.

------------------------------------------------------------------------

## Editing Poster Art

Most visual changes should happen in:

``` text
src/components/SwissPosterArt.tsx
```

The component contains the visual building blocks and variants.

Before adding a new shape, ask:

> What job does this shape perform?

If the answer is only "to make the screen less empty," consider using
spacing or changing the composition instead.

------------------------------------------------------------------------

## Editing Composition Logic

Changes to visual selection and lyric analysis generally belong in:

``` text
src/components/PosterComposition.tsx
```

This file decides which composition is appropriate.

Try to keep visual drawing code in `SwissPosterArt.tsx` rather than
putting large JSX blocks into the selection logic.

------------------------------------------------------------------------

## Editing Colors and Composition Rules

Check:

``` text
src/config/composition.ts
src/engine/CompositionEngine.ts
```

before adding another independent color-selection system.

Keeping related rules in one place makes the visual system easier to
maintain.

------------------------------------------------------------------------

## Testing Checklist

Before considering a visual change finished, test:

-   [ ] short lyric
-   [ ] long lyric
-   [ ] Japanese-only lyric
-   [ ] bilingual lyric
-   [ ] quiet lyric
-   [ ] dramatic lyric
-   [ ] desktop
-   [ ] mobile
-   [ ] light/dark text contrast
-   [ ] beginning of lyric
-   [ ] end of lyric
-   [ ] transition to the next lyric
-   [ ] production build

------------------------------------------------------------------------

## Git Workflow

Use small, understandable commits.

Example:

``` bash
git add .
git commit -m "Add asymmetric poster layout"
git push
```

Avoid committing generated build folders or local dependency folders.

------------------------------------------------------------------------

## Deployment

After pushing to the configured repository, Vercel can build the
project.

If Vercel fails:

1.  Read the build output.
2.  Find the first real compiler/linter error.
3.  Fix that error.
4.  Run `npm run build` locally.
5.  Push again.

Do not repeatedly redeploy without understanding the error.
