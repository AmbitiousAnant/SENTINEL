---
name: Sentinel Core
colors:
  surface: '#f9f9f7'
  surface-dim: '#dadad8'
  surface-bright: '#f9f9f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f4f1'
  surface-container: '#eeeeec'
  surface-container-high: '#e8e8e6'
  surface-container-highest: '#e2e3e0'
  on-surface: '#1a1c1b'
  on-surface-variant: '#414844'
  inverse-surface: '#2f3130'
  inverse-on-surface: '#f1f1ef'
  outline: '#717974'
  outline-variant: '#c1c8c2'
  surface-tint: '#426656'
  primary: '#2a4e3f'
  on-primary: '#ffffff'
  primary-container: '#426656'
  on-primary-container: '#bae2ce'
  inverse-primary: '#a8cfbc'
  secondary: '#56615a'
  on-secondary: '#ffffff'
  secondary-container: '#d7e3da'
  on-secondary-container: '#5a655e'
  tertiary: '#7300a4'
  on-tertiary: '#ffffff'
  tertiary-container: '#8f2bc0'
  on-tertiary-container: '#f2ccff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c4ecd7'
  primary-fixed-dim: '#a8cfbc'
  on-primary-fixed: '#002115'
  on-primary-fixed-variant: '#2a4e3f'
  secondary-fixed: '#dae5dc'
  secondary-fixed-dim: '#bec9c1'
  on-secondary-fixed: '#141e18'
  on-secondary-fixed-variant: '#3f4943'
  tertiary-fixed: '#f6d9ff'
  tertiary-fixed-dim: '#e9b3ff'
  on-tertiary-fixed: '#310048'
  on-tertiary-fixed-variant: '#7200a3'
  background: '#f9f9f7'
  on-background: '#1a1c1b'
  surface-variant: '#e2e3e0'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 57px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-lg:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.1px
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.5px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-padding-mobile: 1.25rem
  container-padding-desktop: 48px
  gutter: 16px
---

## Brand & Style

The design system is anchored in the concept of "Quiet Intelligence." It moves away from the frenetic energy of typical AI interfaces, instead embracing a **Corporate Minimalist** aesthetic with **Tactile** undertones. The personality is protective yet non-intrusive, prioritizing privacy through a "Subdued Watcher" visual metaphor.

The UI should evoke an emotional response of absolute safety and clarity. To achieve this, the system utilizes expansive whitespace, a muted organic palette, and high-precision typography. Visual interest is generated through data-driven art—specifically the 'Sentinel Signal'—rather than decorative flourishes. Surfaces feel like physical stationery or premium architectural materials, providing a grounded, reliable environment for sensitive well-being data.

## Colors

This design system uses a sophisticated, low-chroma palette to reinforce the "Privacy-First" narrative. 

- **Primary & Secondary:** Utilize the deep forest greens (`#426656`) and slate greys (`#56615a`) to represent growth and stability.
- **Surfaces:** Use a tiered hierarchy of warm greys (`#f9f9f7` to `#e2e3e0`). Backgrounds should never be pure white unless they are actionable card surfaces intended to "pop" against the warm base.
- **The Signal:** The Tertiary Purple (`#b453e5`) is a vibrant violet reserved exclusively for the 'Sentinel Signal' current deviation and high-priority insights, creating a clear visual shorthand for "Intelligent Intervention."
- **Interaction States:** Use `primary-container` for subtle hover states and `surface-variant` for inactive or disabled regions.

## Typography

The typography system creates a clear distinction between **Structural Information (Manrope)** and **Human Information (Hanken Grotesk)**.

- **Manrope:** Use for all branding, headers, and statistical callouts. It should feel geometric and architectural.
- **Hanken Grotesk:** Use for all reading experiences, tooltips, and labels. Its slightly more humanist construction makes long-form well-being insights more approachable.
- **Hierarchy:** Ensure `display-lg` is used sparingly for daily summary scores. `label-sm` is strictly for metadata or legal disclaimers.

## Layout & Spacing

The design system utilizes a **strict 8px grid** to ensure mathematical harmony.

- **Mobile:** Uses a single-column fluid layout with `1.25rem` (20px) horizontal margins. Content blocks are separated by `24px` vertical margins.
- **Desktop:** Employs a 12-column fixed grid (max-width 1280px) with `24px` gutters. 
- **The "Breath" Rule:** Components should favor generous internal padding (`16px` to `24px`) to reinforce the feeling of "calm" and prevent the interface from feeling data-heavy or overwhelming.
- **Sentinel Signal Alignment:** Visualizations must span the full width of their parent container, bleeding into the padding where appropriate to suggest continuity.

## Elevation & Depth

Depth in this design system is achieved through **Tonal Layering** and **Soft Insets** rather than traditional drop shadows.

- **Surface Levels:** The base background is `#f9f9f7`. Primary content cards sit on `#ffffff`. Secondary modules or inactive states use `#eeeeec`.
- **Shadows:** When shadows are necessary for high-level modals or floating action buttons, use a very soft, diffused shadow: `0px 4px 20px rgba(26, 28, 27, 0.04)`.
- **The "Privacy" Inset:** For sensitive input fields or "Private Vault" areas, use a subtle 1px inner stroke of `#dadad8` to create a "recessed" feeling, implying the data is tucked away safely.

## Shapes

The shape language is defined by **Softened Geometry**. 

- **Standard Elements:** Buttons and small components use an `8px` radius (`rounded`).
- **Containers:** Dashboard cards and main content areas use a `16px` radius (`rounded-lg`).
- **Interactive Pill:** Use `rounded-xl` (24px+) for status chips and toggle switches.
- **The Signal Line:** The organic line visualization should use a "natural curve" algorithm (Cubic Bezier) to ensure no sharp angles, mirroring the organic nature of human biological data.

## Components

### Buttons
- **Primary:** Background `#426656`, Text `#ffffff`, 8px border radius. No shadows.
- **Secondary:** Background `#d7e3da`, Text `#5a655e`.
- **Tertiary/Ghost:** No background, Text `#414844`, underline on hover.

### Cards
- **Insight Card:** White background, 16px radius, 1px stroke of `#eeeeec`.
- **Alert Card:** Surface `tertiary-container` (`#edbfff`) for positive insights, or `error-container` (`#ffdad6`) for critical deviations.

### Input Fields
- Filled style using `#f4f4f1`. Bottom-only border of 2px in `#414844` when focused. Label text in `label-md` Hanken Grotesk.

### The Sentinel Signal (Signature Component)
- **Baseline:** A steady, thin dashed line in `#dadad8`.
- **Current Flow:** A thick, organic solid line in `#426656` (Primary) or `#b453e5` (Tertiary) if a deviation is detected. The area between baseline and current should be filled with a 5% opacity gradient of the line color.

### Chips & Tags
- Used for well-being markers (e.g., "Deep Sleep," "Low Stress"). Pill-shaped with a background of `#e8e8e6` and `label-sm` text.