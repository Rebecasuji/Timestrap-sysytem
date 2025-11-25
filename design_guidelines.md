# Knockturn Private Limited - Employee Timesheet Design Guidelines

## Design Approach
**Futuristic Professional Dashboard** - Drawing inspiration from modern SaaS dashboards like Linear and Vercel, combined with cyberpunk-inspired glowing UI elements. This is a utility-focused application requiring clean data presentation with strategic animation to enhance professionalism.

## Core Visual Identity

### Color Palette
- **Primary Background**: Pure black (#000000) to deep charcoal gradient
- **Accent**: Electric blue (#0EA5E9 to #3B82F6) for glows, highlights, and interactive elements
- **Gradients**: Radial and linear blue-to-black gradients for depth
- **Text**: White (#FFFFFF) primary, blue-tinted gray (#94A3B8) secondary
- **Success/Active**: Bright cyan (#06B6D4) for recording states
- **Borders**: Subtle blue glow (rgba(59, 130, 246, 0.3))

### Logo Integration
- Header: Top-left corner, max-width of 180px-200px
- Login page: Centered above authentication form, larger scale (240px-280px)
- Maintain aspect ratio, apply subtle blue glow on dark backgrounds

## Typography
- **Headings**: Inter or Space Grotesk (700-800 weight) for futuristic feel
- **Body**: Inter (400-500 weight)
- **Data/Numbers**: JetBrains Mono or Roboto Mono for time displays
- **Scale**: text-sm for labels, text-base for inputs, text-lg/xl for headers, text-3xl/4xl for hero elements

## Layout System
**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16 (p-4, gap-6, mb-8, etc.)
- Consistent padding: p-6 for cards, p-8 for page containers
- Gap spacing: gap-4 between form elements, gap-6 between sections

## Component Library

### Login Page
- **Lamp Pull Animation**: SVG lamp with chain in center, GSAP timeline animation on interaction
- **Form Container**: Glassmorphic card (backdrop-blur-xl, bg-black/40, border border-blue-500/30)
- **Input Fields**: Dark background with blue bottom border, focus state with full blue glow
- **Button**: Primary electric blue with intense glow on hover (shadow-[0_0_20px_rgba(59,130,246,0.6)])

### Tracker Page Header
- **Top Bar**: Fixed position, glass effect background
- **Calendar Widget**: Inline date picker with blue highlights for selected dates
- **Shift Selector**: Pill-style toggle buttons (4hr/8hr/12hr) with active state glowing blue
- **Total Time Display**: Large, monospace font with pulsing blue glow when recording

### Task Management
- **Task Cards**: Expandable rows with smooth height transition
- **Recording Button**: Circular button, red pulse animation when active, blue when stopped
- **Tools Multi-Select**: Dropdown with checkboxes, blue check icons, max-height with scroll
- **Time Inputs**: Split hour:minute pickers with up/down arrows
- **Add Task Button**: Fixed bottom-right corner, floating action button with blue gradient and shadow

### Analytics Section
- **Chart Containers**: Dark cards with subtle blue border glow
- **Chart.js Styling**: Blue gradient fills, white labels, transparent backgrounds
- **Grid Layout**: 2-column on desktop (lg:grid-cols-2), single column mobile

## Animation Guidelines

### GSAP Animations
- **Page Transitions**: 0.6s ease-out slide-in from bottom
- **Card Entrance**: Stagger animation (0.1s delay between items)
- **Lamp Pull**: Chain pull → lamp swing → light glow sequence (2s total)
- **Task Row Expand**: Height auto with 0.3s ease timing

### Hover Effects
- **Cards**: Lift effect (translateY(-4px)) with intensified blue glow
- **Buttons**: Scale(1.05) with shadow expansion
- **Input Focus**: Border glow expansion animation

### Parallax
- **Background Elements**: Subtle geometric shapes with 0.3-0.5 parallax speed
- **Section Dividers**: Gradient lines with slow vertical movement

## Responsive Behavior
- **Desktop** (lg): Multi-column layouts, expanded charts, side-by-side forms
- **Tablet** (md): 2-column max, stacked analytics
- **Mobile**: Single column, bottom sheet for date picker, sticky header with collapsed logo

## Images
- **Logo Placement**: Use the provided Knockturn logo (Screenshot file) throughout
- **No Hero Images**: This is a dashboard application - focus on functional UI, not marketing imagery
- **Icon System**: Use Heroicons for UI elements (outline style for inactive, solid for active states)

## Special Requirements
- **Glassmorphism**: Apply to overlays and modals (backdrop-blur-lg, bg-white/5)
- **Glow Effects**: Use CSS box-shadow with blue rgba values, intensity based on interaction state
- **Data Visualization**: Chart.js with blue color scheme (#3B82F6), transparent backgrounds, white text
- **Loading States**: Skeleton loaders with blue shimmer animation
- **Submit Button**: Disabled state (gray) until shift hours complete, then animated blue pulse effect