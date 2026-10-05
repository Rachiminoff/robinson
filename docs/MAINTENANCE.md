# Maintenance Guide

## General Rule

Robinson has two different kinds of code:

1.  application behavior
2.  visual art direction

Keep those responsibilities separate when possible.

------------------------------------------------------------------------

## When Adding a Visual Variant

Prefer adding a new deliberate composition rather than modifying every
existing variant.

A new variant should have a clear identity.

Document its purpose in comments if the layout is not immediately
obvious.

------------------------------------------------------------------------

## When Changing Existing Visuals

Check whether the change affects:

-   desktop
-   mobile
-   short lyrics
-   long lyrics
-   text contrast
-   transitions
-   animation timing

A small CSS change can have a large visual effect because the
composition system is responsive.

------------------------------------------------------------------------

## Avoiding Visual Repetition

If the application has many variants but they all use the same
structure, the result can still feel repetitive.

When reviewing the system, compare:

-   dominant side
-   shape position
-   shape scale
-   cropping
-   typography location
-   negative space
-   color hierarchy
-   motion direction

Variety should exist across these dimensions.

------------------------------------------------------------------------

## Avoiding Decorative UI

The poster should not look like a dashboard.

Be careful with:

-   excessive borders
-   generic boxes around lyrics
-   floating pills
-   unnecessary badges
-   random bars
-   excessive glow
-   unrelated circles

These elements can make the artwork feel like interface decoration
rather than editorial graphic design.

------------------------------------------------------------------------

## Performance

Generative graphics can become expensive if too many animated DOM
elements are created.

If a visual change introduces many new elements:

1.  test on desktop
2.  test on mobile
3.  watch for dropped frames
4.  reduce unnecessary continuous animations
5.  prefer transforms and opacity for motion where practical

------------------------------------------------------------------------

## Before Release

Run:

``` bash
npm run build
```

Then test the production result.

Verify:

-   audio loads
-   lyrics synchronize
-   desktop works
-   mobile works
-   settings work
-   fullscreen works
-   transitions work
-   no text is clipped
-   no major console errors appear

------------------------------------------------------------------------

## Documentation

When a major system changes, update the relevant document in `docs/`.

Documentation should explain:

-   what the system does
-   why it exists
-   where it lives
-   how to change it
-   what can break

The goal is to make the project understandable to someone who did not
build it originally.
