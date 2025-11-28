# Design Guidelines: GPS Vehicle Alert System with 3D Interface

## Design Approach
**Utility-Focused Application with Specified 3D Aesthetic**
- Professional GPS tracking tool with immersive 3D visual treatment
- Animated background establishing context (GPS/vehicle tracking theme)
- Arabic language support as primary interface language
- Maintain all existing functionality while elevating visual experience

## Core Design Elements

### A. 3D Visual Treatment

**Background Animation**
- Three.js powered animated scene showing GPS grid/map with moving vehicle markers
- Subtle depth-of-field effect keeping background contextual but not distracting
- Color scheme: Deep blues (#1a2332, #243447) with cyan/teal accents (#00d4ff, #00ffc8) for GPS markers
- Low-opacity animated lines connecting points (representing GPS tracking paths)
- Gentle camera drift for dynamic perspective

**Container 3D Effects**
- Main form container floats with depth using CSS transforms and shadows
- Multi-layered shadow system: `0 20px 60px rgba(0,0,0,0.4), 0 8px 20px rgba(0,212,255,0.15)`
- Subtle perspective tilt on container (`transform: perspective(1000px) rotateX(2deg)`)
- Glass morphism effect: semi-transparent background with backdrop blur
- Border with gradient shimmer effect using cyan/teal

**Interactive Elements**
- Input fields with 3D inset appearance
- Buttons with 3D raised effect using box-shadow and transform
- Hover states: subtle lift (`translateY(-2px)`) with enhanced shadow
- Focus states: cyan glow effect without color change

### B. Typography

**Arabic Font Integration**
- Primary: 'Tajawal' (Google Fonts) - modern, clean Arabic typeface
- Weights: 400 (regular), 500 (medium), 700 (bold)
- English fallback: 'Inter' or system-ui

**Hierarchy**
- Main title (h2): 2rem bold, gradient text effect (#00ffc8 to #00d4ff)
- Subtitle: 1.1rem medium, muted cyan (#8cd4e8)
- Labels: 1rem medium, bright cyan (#62f1d6)
- Hints: 0.9rem regular, soft blue-gray (#a0b4c8)
- Inputs/Outputs: 1rem regular

### C. Layout System

**Spacing Units** (Tailwind)
- Primary spacing: 4, 6, 8 for consistent rhythm
- Container padding: p-6 (mobile), p-8 (desktop)
- Section gaps: space-y-6
- Component spacing: mt-4, mb-6 for form elements

**Container Structure**
- Max-width: 480px for optimal form readability
- Centered with margin-top for breathing room
- Full viewport height background
- Mobile: 95% width with minimal side margins

### D. Component Library

**Form Elements**
- File upload: Custom styled with icon (upload cloud) and 3D button appearance
- Textareas: Dark glass background (#1a2a38cc) with cyan border on focus
- Select dropdown: Consistent styling with arrow indicator
- All inputs: 8px border-radius, 3D inset shadow

**Buttons**
- Primary (Generate): Gradient background (#00d4ff to #00ffc8), dark text, 3D raised effect
- Secondary (Copy): Outlined style with cyan border, glass background
- Size: py-3 px-6, 1.05rem text
- Active state: Press-down effect with reduced shadow

**Status Display**
- Company name badge: Floating pill with 3D depth, appears with smooth scale animation
- Output textarea: Larger, read-only with special styling
- Success feedback: Brief glow animation on copy action

**Visual Indicators**
- Alert type icons: 3D icon representations for each alert type (towing, speed, battery, etc.)
- File upload status: Animated checkmark with 3D rotation
- Loading states: Orbital spinner with GPS satellite theme

### E. Animations

**Background**
- Continuous GPS marker movement along paths (3-5 second loops)
- Gentle grid pulse effect (opacity oscillation)
- Slow camera rotation over 30+ seconds

**UI Interactions**
- Container entrance: Fade in with scale and subtle rotate (0.6s ease-out)
- Input focus: Border glow expansion (0.2s)
- Button press: Scale down to 0.98 (0.1s)
- Company name reveal: Scale from 0.8 with fade (0.3s spring)
- Copy confirmation: Brief pulse with color shift

**Performance**
- Use `will-change` sparingly on actively animated elements
- GPU acceleration via `transform: translateZ(0)` on 3D elements
- Limit simultaneous animations to maintain 60fps

## RTL Support
- Set `dir="rtl"` on HTML element
- Tailwind RTL utilities for proper Arabic text flow
- Mirror 3D tilt effects for RTL (negative rotateX values)
- Ensure form labels and hints align naturally to the right

## Responsive Behavior
- Mobile: Reduce 3D effects intensity (simpler shadows, no perspective tilt)
- Background animation: Lower marker count on mobile for performance
- Container: Full-width on mobile with reduced padding
- Typography: Scale down by 10% on small screens

## Images
**None required** - The Three.js animated background provides all visual context needed. No hero images or static graphics necessary for this utility application.