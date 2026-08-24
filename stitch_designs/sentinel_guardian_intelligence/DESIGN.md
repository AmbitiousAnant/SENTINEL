---
name: Sentinel Guardian Intelligence
colors:
  surface: '#f9f9f7'
  surface-dim: '#dadad7'
  surface-bright: '#f9f9f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f4f1'
  surface-container: '#eeeeeb'
  surface-container-high: '#e8e8e6'
  surface-container-highest: '#e2e3e0'
  on-surface: '#1a1c1b'
  on-surface-variant: '#414844'
  inverse-surface: '#2f312f'
  inverse-on-surface: '#f1f1ee'
  outline: '#717974'
  outline-variant: '#c1c8c3'
  surface-tint: '#426656'
  primary: '#2f5344'
  on-primary: '#ffffff'
  primary-container: '#476b5b'
  on-primary-container: '#c2ead6'
  inverse-primary: '#a8cfbc'
  secondary: '#5d5f5d'
  on-secondary: '#ffffff'
  secondary-container: '#e0e0dd'
  on-secondary-container: '#626361'
  tertiary: '#712895'
  on-tertiary: '#ffffff'
  tertiary-container: '#8b43af'
  on-tertiary-container: '#f6d6ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c4ebd7'
  primary-fixed-dim: '#a8cfbc'
  on-primary-fixed: '#002116'
  on-primary-fixed-variant: '#2a4e3f'
  secondary-fixed: '#e3e2e0'
  secondary-fixed-dim: '#c6c7c4'
  on-secondary-fixed: '#1a1c1b'
  on-secondary-fixed-variant: '#464745'
  tertiary-fixed: '#f7d9ff'
  tertiary-fixed-dim: '#e9b3ff'
  on-tertiary-fixed: '#310048'
  on-tertiary-fixed-variant: '#6b218f'
  background: '#f9f9f7'
  on-background: '#1a1c1b'
  surface-variant: '#e2e3e0'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
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
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
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
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  desktop-margin: 2.5rem
  mobile-margin: 1.25rem
  gutter: 1.5rem
  sidebar-width: 280px
---

## Brand & Style
The design system is anchored in the concept of "Quiet Intelligence." It rejects the aggressive, neon-soaked tropes of traditional AI in favor of a **Corporate Modern** aesthetic infused with **Minimalist** and **Tactile** sensibilities. The brand personality is calm and authoritative, aiming to reduce cognitive load for users monitoring sensitive well-being data. 

The visual direction emphasizes privacy through clarity. By using a palette inspired by nature (Forest, Moss) and a highly structured layout, the UI feels like a high-end professional tool rather than a speculative tech demo. The emotional response should be one of safety, precision, and human-centric care.

## Colors
This design system utilizes a sophisticated, low-stimulation palette to maintain a professional and calming atmosphere.

- **Deep Forest (Primary):** Used for key actions, primary branding, and active states. It represents stability and growth.
- **Pale Moss (Background):** The foundational canvas. This off-white, green-tinted neutral reduces eye strain and distinguishes the product from generic white-label SaaS.
- **Cool Slate (Secondary):** Reserved for supporting text, icons, and non-interactive structural elements.
- **Soft Amethyst (Tertiary/Alert):** The single high-contrast accent. It is used exclusively to denote "Meaningful Change" or "Alerts" in user patterns, ensuring these moments are visually distinct without being alarming.
- **Surface & On-Surface:** Tonal layering is achieved using #F4F7F5 for containers to create a subtle lift from the background.

## Typography
The typographic scale is designed for high legibility and a refined, modern feel. 

**Manrope** is used for all headings to provide a sturdy, professional structure. It should be typeset with slightly tighter letter-spacing for large displays to maintain a premium "editorial" feel.

**Hanken Grotesk** is the workhorse for body copy and data labels. Its open counters and clean geometry ensure that even dense pattern-monitoring data remains approachable and easy to scan. Use Medium (500) or SemiBold (600) weights for labels to ensure clear hierarchy against surface colors.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy for content areas, anchored by a persistent sidebar on desktop.

- **Desktop:** 12-column grid. The sidebar is fixed at 280px. Content resides in a fluid container with a maximum width of 1440px and 2.5rem outer margins.
- **Mobile:** Single column with 1.25rem margins. The sidebar collapses into a bottom navigation bar or a top-level drawer.
- **Rhythm:** All spacing (padding, margins, gaps) must be multiples of the 8px base unit. Use larger gaps (32px+) between distinct functional modules to maintain a "breathable" feel.

## Elevation & Depth
This design system avoids heavy, "drop-shadow" heavy aesthetics. Instead, it utilizes **Tonal Layers** and **Ambient Shadows**:

- **Level 0 (Base):** Pale Moss (#DCE8DF) for the main application background.
- **Level 1 (Cards/Surface):** Surface (#F4F7F5) with a 1px stroke of #767775 (at 10% opacity) to define edges.
- **Level 2 (Active/Floating):** Use a very soft, diffused shadow: `0 4px 20px rgba(71, 107, 91, 0.08)`. The shadow color is tinted with the Primary Forest green to maintain organic warmth.
- **Depth via Blur:** When modals are present, use a subtle 4px backdrop blur on the layer below to maintain a sense of space without losing the professional context.

## Shapes
The shape language is organic yet controlled, moving away from aggressive sharp corners to more "human" radii.

- **Standard Elements:** Buttons and input fields use a base **8px** radius (`rounded`).
- **Containers:** Dashboard cards and main content modules use a **16px** radius (`rounded-lg`).
- **Indicators:** Status chips and pattern-tags use a **24px** radius (`rounded-xl`) to create a distinct visual "pill" shape that contrasts with structural containers.
- **Visualizations:** Graphs and pattern lines should use rounded caps and smooth Bezier curves to reflect the "Human" brand personality.

## Components

### Buttons
Primary buttons are #476B5B with white text. Secondary buttons use a #476B5B outline with no fill. All buttons use the 8px radius; they should feel like sophisticated rectangles, never full pills.

### Cards
Cards are the primary vehicle for data. They must use the #F4F7F5 surface color and 16px radius. Card headers should use Manrope Headline-MD for clear sectioning.

### Status Chips
Used for categorization. Unlike buttons, these are full pills (24px radius). When indicating a "Meaningful Change," the chip background becomes a 10% opacity Soft Amethyst with Soft Amethyst text and a 2px left-border accent.

### Input Fields
Inputs use a white background with a 1px border of Cool Slate at 20% opacity. On focus, the border transitions to Deep Forest.

### Data Visualizations
Avoid bars or blocks where possible. Use **Organic Line-based Visualizations**. Lines should be 2px thick with a subtle glow or "shadow" beneath them in the same color to suggest depth. Amethyst is reserved for the specific point on the line where a pattern change is detected.

### Sidebar
The desktop sidebar is a persistent tonal layer (#F4F7F5). Active states in the sidebar use a Deep Forest vertical indicator (4px wide) on the left edge of the navigation item.