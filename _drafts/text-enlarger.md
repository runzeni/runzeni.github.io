---
title: Text enlarger
description: Product discovery brief for an instant screen-sized text tool.
published: false
---

# Text enlarger — discovery brief

Status: Stage 4, refined working tool at `/misc/text/`.

## Product promise

Type a message and make it readable across a room in two actions or fewer.

The tool is a sign, not a document editor. It should open ready to type, show the result immediately, and stay useful when browser APIs are unavailable.

## Primary situations

- Pickup: show one passenger name at maximum size.
- Discussion: show a short thought, question, or response across a table or classroom.
- Direction: display a short instruction such as “Gate C12” or “Meet outside”.

## Recommended interaction

1. The screen opens as a large editable canvas with a quiet “Lorem ipsum” placeholder that disappears on input.
2. Typing updates the presentation surface immediately.
3. `Fit` is on by default. A horizontal size slider appears only after the user chooses manual sizing.
4. A quiet bottom dock contains font, fit/manual size, color, rotate, and full screen. Copy sits at the top right of the canvas.
5. Full-screen mode fades the controls without moving or resizing the message. One tap reveals them again.

A slider is preferable to a size dropdown: the result is visual, continuous, and device-dependent. Fixed point sizes imply precision that does not translate between a phone and a desktop. The automatic fit action should remain the primary control.

## V1 controls

- Font: Serif / Sans, using Source Serif 4 and IBM Plex Sans already loaded by the site.
- Fit: one tap returns to the largest size that fits both width and height.
- Size: manual slider, approximately 24–320 px, shown only in manual mode.
- Copy: copy the plain message text with one action and reuse the site-wide copy confirmation.
- Color: one-tap cycle through four tested pairs: paper/ink, ink/paper, yellow/ink, blue/white.
- Rotate: rotate the presentation surface 90 degrees with CSS; do not rely on orientation lock.
- Full screen: request fullscreen when supported, otherwise hide site chrome and use the full viewport.
- Stay awake: opt in while presenting when the Screen Wake Lock API is available.
- Reset: return layout controls to defaults without erasing the message.

## Technical direction

Use plain HTML, CSS, and one small JavaScript module. No framework.

Start with a local fit routine using `ResizeObserver` and a bounded binary search against `scrollWidth` and `scrollHeight`. It keeps multiline fitting, padding, and rotated dimensions under our control. Recalculate after `document.fonts.ready` and viewport/orientation changes.

Do not add a dependency for V1. If testing exposes measurement instability, Fitty 2.4.2 is the fallback: it is dependency-free and supports multiline, min/max sizes, font loading, and viewport updates. Its width-oriented fitting model still needs additional height and rotation handling, so it does not remove the product-specific work.

Use feature detection for Fullscreen and Screen Wake Lock. Orientation locking should not be required; CSS rotation is predictable across browsers. Store presentation preferences locally, but do not persist the message by default.

## Non-goals for V1

- Accounts, cloud sync, or analytics.
- Rich text, multiple text blocks, images, or document export.
- Sharing message text in a URL.
- A large template gallery.
- Animation beyond the text-size and control-dock transitions.

## Decisions implemented

1. Public name: Text enlarger.
2. Route: `/misc/text/`, linked from Playground.
3. One editable surface becomes the presentation surface.
4. No presets or instructional copy; a non-content placeholder demonstrates the interaction without becoming part of the message.
5. Full screen requests the browser mode, uses an in-page fallback, keeps message geometry fixed as controls fade, and requests screen wake lock when available.
6. Preferences persist locally; message text does not.

## Stage 2 validation

- Sketch the one-surface and two-mode flows at 390 × 844 and 1440 × 900.
- Test very short, long, multiline, emoji, CJK, and pasted text.
- Verify keyboard avoidance on mobile and safe-area spacing.
- Confirm rotation and fullscreen fallbacks on iOS Safari, Android Chrome, desktop Safari, Chrome, and Firefox.
- Decide the smallest control set before writing the prototype.
