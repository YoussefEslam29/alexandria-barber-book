# Kral Salon - Motion Graphics Manifesto

## Core Philosophy
The Kral Salon platform is built upon the "Sovereign Industrial" design language. To translate this into digital interaction, our motion graphics are designed to feel **heavy, deliberate, and premium**. We avoid bouncy, spring-based animations which feel cheap, and instead use precise, customized easing curves that convey luxury.

## Global Constants

### Custom Ease (The "Sovereign Curve")
```typescript
const customEase = [0.16, 1, 0.3, 1];
```
This cubic-bezier curve provides a fast initial acceleration followed by a slow, smooth deceleration. It simulates physical weight and precision, perfect for sliding elements into view.

### Standard Duration
Most major structural animations (e.g., hero text reveals, section scroll-triggers) should use a duration of `0.6s` to `0.9s`.

## Interaction Library

### 1. Scroll-Triggered Reveals ("Industrial Sanctuary")
All content blocks (cards, videos, text) entering the viewport must fade in and slide up.
*   **Initial State:** `opacity: 0, y: 20`
*   **Visible State:** `opacity: 1, y: 0`
*   **Transition:** `duration: 0.6`, `ease: customEase`
*   **Parent Stagger:** `.1s` delay between child elements for a cascading reveal effect.

### 2. "Liquid Gold" Transitions (Premium Services)
For our highest-tier offerings (like the Home Service), interactions use expanding radial gradients.
*   **Trigger:** Hovering over the premium card.
*   **Animation:** An `AnimatePresence` controlled `motion.div` expands a radial gradient from `scale: 0` to `scale: 3` originating from the center of the card.
*   **Z-Index Management:** Ensuring the content remains above the effect (`z-10`) while the effect acts as a dynamic background layer (`z-0`).

### 3. "Cyan Pulse" Navigation
The main navigation uses an architectural approach.
*   **Underline Effect:** A `2px` line that expands from the center (`scale-x` or `width`) to 100% on hover.
*   **Glow:** Incorporates a subtle shadow (`shadow-[0_0_8px_rgba(0,219,231,0.8)]`) to match the Electric Cyan accent color of the brand.

### 4. Cinematic Reveals (Hero Section)
*   **Staggered Text:** Headings are split and slid up from behind an invisible mask.
*   **Ken Burns Effect:** The background video/image applies a continuous, extremely slow `scale: 1.05` transition over a long duration.
*   **Magnetic CTA:** Buttons interact with the user's cursor within a defined radius using a low-stiffness spring.

### 5. Multi-Step Flow (Booking Modal)
To prevent overwhelming the user with a massive form, the booking flow is split into 3 steps.
*   **Cross-Fade Slide:** Transitions between steps utilize `AnimatePresence` with `mode="wait"`.
*   **Variants:** 
    *   Entering: `opacity: 1, x: 0`
    *   Exiting: `opacity: 0, x: -20` (sliding to the left)
    *   Initial: `opacity: 0, x: 20` (sliding in from the right)
*   **Success State:** The flow culminates in a 'Seal of Excellence' animation (a rotating, pulsing gold ring surrounding the Crown icon) to validate the user's completion of the booking.

---

**Remember:** If you are adding new components to the Kral Salon app, always ask yourself: *"Does this feel Sovereign?"*

## 🎬 Motion Graphics & Micro-Interactions (April 21, 2026)
- **Engine:** Integrated Framer Motion for cinematic UX.
- **Hero Animation:** Implemented masked text reveals and Ken Burns background scaling.
- **Interaction Design:** Added 'Magnetic' CTA buttons and liquid-glow hover states for Premium Gold services.
- **Performance:** Optimized scroll-reveal staggering using `whileInView` viewport triggers.
- **Easing Profile:** Standardized on 'Industrial Heavy' cubic-bezier curves (0.16, 1, 0.3, 1).