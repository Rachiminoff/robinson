# Generative Composition

## Purpose

The generative composition system exists to make the lyric video
visually varied without manually designing every single lyric screen.

The word "generative" here does not mean that the application creates
completely uncontrolled artwork.

It means the application chooses from a designed set of visual rules.

------------------------------------------------------------------------

## 1. Lyric Analysis

Before choosing a composition, the system can inspect the active lyric.

Useful characteristics include:

  Property           Why it matters
  ------------------ ---------------------------------------------------
  Japanese length    Helps determine how much text space is needed
  English length     Helps determine secondary text size and placement
  Word count         Gives an idea of text density
  Duration           Helps influence motion and pacing
  Repetition         Can support rhythmic or modular layouts
  Punctuation        Can influence emphasis
  Question mark      Can suggest a more expressive treatment
  Short / long       Helps avoid using the same layout for every line
  Quiet / dramatic   Helps guide visual intensity

These values are not meant to "understand" the song perfectly. They are
practical signals that help the visual system make better choices.

------------------------------------------------------------------------

## 2. Visual Families

The composition system has several broad visual directions.

Examples include:

-   Swiss grid
-   modular blocks
-   Bauhaus-inspired geometry
-   cropped poster fields
-   negative-space compositions
-   vertical editorial layouts
-   kinetic rule systems
-   typographic monuments

A visual family describes the overall behavior of a composition.

It does not define every shape.

------------------------------------------------------------------------

## 3. Variants

Within the visual families there are multiple poster variants.

A variant is a specific arrangement of visual elements.

For example, one variant may use:

``` text
large left field
+
small counterform
+
horizontal rule
```

Another may use:

``` text
cropped circle
+
vertical spine
+
small editorial blocks
```

The important part is that the elements are arranged differently.

Changing only the color is not considered enough variation.

------------------------------------------------------------------------

## 4. Layout Mutation

The layout system adds another layer of variation.

It can change:

-   horizontal position
-   vertical position
-   scale
-   rotation
-   edge cropping
-   dominant side
-   visual spine
-   top or bottom emphasis
-   corner weight
-   negative-space distribution

This prevents different poster variants from feeling like the same
template with different colors.

------------------------------------------------------------------------

## 5. Color

Color is selected as part of the composition rather than being treated
as an unrelated background.

The palette can contain strong fields such as:

-   red
-   blue
-   cyan
-   yellow
-   orange
-   pink
-   purple
-   green
-   cream
-   gray
-   black

The exact palette is controlled by the composition system.

Color should support contrast and hierarchy. It should not make the
lyric difficult to read.

------------------------------------------------------------------------

## 6. Deterministic Selection

A simplified example is:

``` text
seed = lyric time + lyric index + device offset
```

The seed is then used by the random utility.

Because the seed is stable, the same input can produce the same visual
decision.

This is useful for debugging.

If a composition suddenly looks wrong, the developer can reproduce the
same lyric and inspect the same visual result instead of chasing a
different random result every time.

------------------------------------------------------------------------

## 7. Device-Specific Variation

Desktop and mobile are intentionally given different seed offsets.

The reason is simple:

A desktop screen and a phone screen do not provide the same design
space.

A layout that works well on a wide screen may feel cramped on a narrow
screen.

Therefore the system can choose a different visual direction for mobile
instead of simply shrinking the desktop version.

------------------------------------------------------------------------

## 8. Variety Rules

When improving the composition system, variety should be measured in
more than one way.

Good variation can involve:

-   different dominant areas
-   different shape relationships
-   different alignment
-   different cropping
-   different scale
-   different amount of negative space
-   different typography placement
-   different color relationships
-   different motion behavior

Avoid a system where every screen follows:

``` text
background
+
one circle
+
one rectangle
+
text in center
```

That is technically varied but visually repetitive.

------------------------------------------------------------------------

## 9. Readability Comes First

Generative design should never make the lyrics unreadable.

Every composition should leave enough room for:

-   the main lyric
-   the supporting translation
-   margins around text
-   visual contrast
-   safe areas on small screens

If a composition looks interesting but makes the lyric difficult to
read, the composition is not successful.

------------------------------------------------------------------------

## 10. Adding a New Variant

When creating a new variant:

1.  Decide its main visual idea.
2.  Decide where the visual weight lives.
3.  Decide where the lyric will have space.
4.  Choose a limited number of shapes.
5.  Establish the hierarchy.
6.  Test light and dark text.
7.  Test desktop.
8.  Test mobile.
9.  Test a short lyric.
10. Test a long lyric.
11. Test the transition into and out of the variant.

The goal is not to add more shapes.

The goal is to add a genuinely different composition.
