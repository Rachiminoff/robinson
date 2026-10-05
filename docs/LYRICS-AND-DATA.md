# Lyrics and Data

## Purpose

The lyric data tells Robinson when each lyric should appear.

The visual system depends on accurate timing.

If the timing is wrong, the artwork may change too early or too late
even when the visual code is correct.

------------------------------------------------------------------------

## Lyric Structure

The exact fields should follow the current TypeScript definitions in the
project.

Conceptually, each lyric has information similar to:

``` text
index
start
end
Japanese text
English text
```

The `start` and `end` values define the time range for the lyric.

------------------------------------------------------------------------

## How Playback Uses Lyrics

During playback:

``` text
current audio time
       ↓
search lyric timing
       ↓
find active lyric
       ↓
generate visual composition
```

Only the lyric that matches the current time should be treated as
active.

------------------------------------------------------------------------

## Why Timing Matters to Design

The lyric duration can influence visual behavior.

A very short lyric may need a simpler or faster composition.

A longer lyric has more time for a larger visual arrangement to appear.

This does not mean every short lyric must use the same layout. It is
simply one signal used by the composition system.

------------------------------------------------------------------------

## Editing Lyrics

When changing lyric data:

1.  Preserve the expected TypeScript structure.
2.  Check that start times are ordered correctly.
3.  Check that end times do not unexpectedly overlap.
4.  Confirm Japanese and English text.
5.  Test the song from the beginning.
6.  Test transitions around the edited lyric.

------------------------------------------------------------------------

## Long Text

Long lyrics need special attention.

The composition should provide enough room for the text rather than
forcing the text into a decorative area.

If a lyric becomes too large:

-   adjust typography sizing
-   adjust available width
-   change alignment
-   allow a different composition
-   preserve readable line spacing

Do not solve every overflow problem by simply shrinking all text.

------------------------------------------------------------------------

## Maintaining Synchronization

The audio file and lyric timing should be treated as a pair.

If the audio changes, lyric timings may need to be reviewed.

If only the lyrics change, confirm that the timing still matches the
existing audio.
