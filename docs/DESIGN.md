# Design System: uyuk

This document defines the visual language and implementation specifications for uyuk. It prioritizes information density, a terminal-inspired aesthetic, and a dark-first interface.

## Core Principles

1. Compact and dense. Maximize information per pixel.
2. No borders on grid cells, no rounding. Use sharp edges and flat surfaces. Structural dividers (e.g., focus rings, active indicators) use subtle alternatives like background changes or thin outlines.
3. Monospace for data, sans-serif for UI labels.
4. Dark-first. Dark mode is the primary interface.
5. Color comes from habit grids, not from chrome or UI elements.
6. Minimal animations. Use only subtle fades and scales.
7. Function over decoration. Every pixel must serve a purpose.

## Typography

### Fonts
- Data and Numbers: JetBrains Mono
- Labels and Headings: Inter

### Type Scale
- xs: 0.75rem (12px)
- sm: 0.875rem (14px)
- base: 1rem (16px)
- lg: 1.125rem (18px)
- xl: 1.25rem (20px)
- 2xl: 1.5rem (24px)

### Weights and Usage
- Regular (400): Body text, secondary labels.
- Medium (500): Primary UI labels, button text.
- Semi-bold (600): Section headings.
- Bold (700): Page titles, emphasized stats.

### Line Heights
- Data/Tables: 1.1 (Tight)
- Labels/Forms: 1.5 (Standard)

## Color System (Dark Theme)

### Base Colors
- Background: #0a0a0a
- Background Elevated (Modals, Sidebar): #121212
- Background Subtle (Hover, Active): #1a1a1a
- Text Primary: #ededed
- Text Secondary: #a1a1a1
- Text Disabled: #525252
- Divider: #262626
- Selection/Focus: #3b82f6

### Habit Color Palette
Curated for heatmap visibility and contrast.

- Red: #ef4444
- Orange: #f97316
- Yellow: #eab308
- Green: #22c55e
- Teal: #14b8a6
- Blue: #3b82f6
- Indigo: #6366f1
- Purple: #a855f7
- Pink: #ec4899
- Slate: #64748b
- Lime: #84cc16
- Rose: #f43f5e

### Semantic Colors
- Success: #22c55e
- Warning: #f59e0b
- Error: #ef4444
- Info: #3b82f6

### Grid Intensity Mapping
Intensity is determined by completion percentage.

- 0%: Background (#1a1a1a)
- 1% to 25%: 25% opacity of habit color
- 26% to 50%: 50% opacity of habit color
- 51% to 75%: 75% opacity of habit color
- 76% to 100%: 100% opacity of habit color

The combined summary grid uses #ededed as the base color with the same opacity steps.

## Spacing System
Based on Tailwind units (1 unit = 4px).

- 0: 0px
- 1: 4px
- 2: 8px
- 3: 12px
- 4: 16px
- 5: 20px
- 6: 24px
- 8: 32px
- 10: 40px
- 12: 48px
- 16: 64px

## Grid and Heatmap Specifications

### Cell Dimensions
- Table View Day Cell: 32px x 32px
- Grids View Day Cell: 12px x 12px

### Rendering Rules
- No gaps between cells in the same row/column.
- No border radius.
- No borders on cells.
- Partial completion in table view: Fill cell from bottom to top based on percentage.

### Layout
- Columns: 7 days, ordered based on user's week start setting (Sunday or Monday).
- Rows: N (number of weeks).
- Labels: Month labels placed above the grid, aligned to the start of the first week of that month. Day headers (M, T, W, T, F, S, S) placed above columns.

## Component Specifications

### Table View Row
- Height: 40px.
- Padding: Left/Right 12px.
- Layout: [Drag Handle] [Icon] [Name] [Spacer] [N Day Cells (configurable, default 7)] [Stats].
- Today Highlight: Background #1a1a1a with 2px solid #3b82f6 bottom accent on the current day column.
- Hover: Background #1a1a1a.
- Stats: Displayed as compact numbers (e.g., 5/7) at the end of the row.

### Grids View Card
- Padding: 16px.
- Layout: [Name + Stats Header] [Gap 8px] [Heatmap Grid].
- Spacing: 16px between cards.
- Combined Grid: Always appears at the top, uses #ededed scale.

### Habit Form
- Inputs: No border. Background #1a1a1a. 1px #262626 bottom underline for text fields.
- Color Picker: 4x3 grid of 24px squares.
- Type Toggle: Segmented control with sharp corners.
- Buttons: Sharp corners, solid background for primary, ghost for secondary.

### Navigation
- Bottom Tab Bar: 56px height. 24px icons with 10px labels.
- Sidebar: 240px width (collapsed to 64px). Active item marked by #3b82f6 background tint (#3b82f6 at 10% opacity) and #1a1a1a background.

### Buttons
- Primary: Background #ededed, Text #0a0a0a.
- Secondary: Background #1a1a1a, Text #ededed.
- Destructive: Background #ef4444, Text #ededed.
- Sizes: sm (24px height), md (32px height), lg (40px height).

### Modal
- Backdrop: #000000 at 70% opacity.
- Width: Max 480px.
- Layout: Header with title, Body for form, Footer for actions. No close button; use Escape or click outside.

## Responsive Breakpoints

- sm (640px): Sidebar hidden, Bottom Tab Bar visible. Table cells shrink to 28px.
- md (768px): Sidebar visible (collapsed). Grid cells increase to 14px.
- lg (1024px): Sidebar expanded. Table cells at 32px.
- xl (1280px): Multi-column Grid View (2 columns).
- 2xl (1536px): Multi-column Grid View (3 columns).

## Animations

- Completion Tap: Scale 1.05 for 100ms.
- Data Load: Opacity 0 to 1 over 150ms.
- Modal Open: Opacity 0 to 1 and Translate Y 10px to 0 over 200ms.
- Drag and Drop: 0.8 opacity for dragged element. No spring effects.

## Accessibility

- Focus: 2px solid #3b82f6 with 2px offset.
- Touch Targets: Minimum 44px x 44px for mobile interactions.
- Grid Accessibility: Each cell must have an aria-label indicating date and status (e.g., "March 1, 2026: 100% complete").
- High Contrast: Ensure text secondary (#a1a1a1) meets 4.5:1 ratio against background.