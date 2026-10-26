---
name: SmartAudit System
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#434655'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#006591'
  on-secondary: '#ffffff'
  secondary-container: '#39b8fd'
  on-secondary-container: '#004666'
  tertiary: '#ae0010'
  on-tertiary: '#ffffff'
  tertiary-container: '#d52022'
  on-tertiary-container: '#ffecea'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#c9e6ff'
  secondary-fixed-dim: '#89ceff'
  on-secondary-fixed: '#001e2f'
  on-secondary-fixed-variant: '#004c6e'
  tertiary-fixed: '#ffdad6'
  tertiary-fixed-dim: '#ffb4ab'
  on-tertiary-fixed: '#410002'
  on-tertiary-fixed-variant: '#93000b'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  data-mono:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: -0.01em
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-lg: 1.5rem
  margin: 1rem
  margin-md: 1.5rem
  margin-lg: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system targets forensic accountants, internal auditors, finance directors, and compliance officers who inspect high-volume disbursement data under strict regulatory scrutiny. The visual tone balances precision engineering with absolute clarity: trustworthy, clinical, objective, and unflinchingly direct. 

The aesthetic is Modern Corporate with Technical Precision. It rejects decorative clutter, excessive decorative gradients, and playful micro-interactions in favor of high-density data legibility, rapid pattern identification, and unquestioned forensic certainty. Interface surfaces maintain crisp boundaries and disciplined contrast ratios to minimize cognitive fatigue during extended audit sessions and side-by-side reconciliation workflows.

## Colors

The palette establishes a clinical hierarchy calibrated for WCAG AAA compliance on critical readouts and WCAG AA across structural controls.

- **Primary Canvas & Neutrals**: 
  - Canvas Base: `#FFFFFF` for primary focus cards and inspection viewports.
  - Sub-canvas Surface: `#F8FAFC` (Slate 50) for outer canvas backgrounds and alternating table tiers.
  - Muted Container Surface: `#F1F5F9` (Slate 100) for nested panels, ledger headers, and OCR bounding zones.
  - Borders & Gridlines: `#E2E8F0` (Slate 200) for structural division, `#CBD5E1` (Slate 300) for interactive control borders.
  - Body Text: `#0F172A` (Slate 900) for dominant display figures and body copy; `#475569` (Slate 600) for secondary metadata.

- **Brand & Action (Blue / Cyan)**:
  - Primary Base: `#2563EB` (Blue 600) for confirmed audit actions, primary triggers, and active navigation nodes.
  - Primary Hover / Pressed: `#1D4ED8` (Blue 700) and `#1E40AF` (Blue 800).
  - Accent / Informational: `#0EA5E9` (Sky 500) for secondary telemetry, processing queues, and active OCR anchor crosshairs.

- **Forensic Status Scales (Semantic)**:
  - Critical / Fraud Anomaly: `#DC2626` (Red 600) base, paired with `#FEF2F2` (Red 50` background tint and `#991B1B` (Red 800) label text.
  - Discrepancy / Warning: `#F59E0B` (Amber 500) base, `#FFFBEB` background tint, and `#92400E` (Amber 800) label text.
  - Verified / Cleared: `#10B981` (Emerald 500) base, `#ECFDF5` background tint, and `#065F46` (Emerald 800) label text.

## Typography

Typography prioritizes tabular legibility and rapid structural scanning. Plus Jakarta Sans handles titles and summary metrics, delivering geometric structure without decorative flair. Inter handles all body text, audit logs, form inputs, and comparative tables.

All numeric readouts, ledger balances, transaction hashes, and OCR confidence indices must enable tabular lining figures (`font-variant-numeric: tabular-nums lining-nums`) to ensure vertical column alignment across comparative ledgers. Section label indicators use uppercase styling paired with expanded tracking (`0.04em`) to establish unambiguous structural boundaries.

## Layout & Spacing

The layout runs on a fluid 12-column grid anchored by an 8px spatial baseline (with 4px micro-steps for tight tabular density).

- **Grid Architecture**:
  - Desktop (≥1280px): 12 columns, 24px (`gutter-lg`) gutters, 32px (`margin-lg`) margin. Optimized for split-view auditing: 5 columns for receipt OCR imagery and 7 columns for disbursement field mapping.
  - Tablet (768px – 1279px): 8 columns, 16px (`gutter`) gutters, 24px (`margin-md`) margin. Comparative panels stack into tabbed inspection workflows.
  - Mobile (<768px): 4 columns, 16px gutters, 16px (`margin`) margins. Tables shift to vertical record cards.

Spatial density remains compact: data cells and nested list items apply `space-sm` (8px) vertical padding to maximize visible audit rows per screen, while primary structural blocks maintain `space-lg` (24px) breathing room.

## Elevation & Depth

This system utilizes low-contrast outlines coupled with tight, low-diffusion ambient shadows. Depth serves strictly to delineate interactive overlays from static audit records.

- **Level 0 (Flat / Canvas)**: Background surfaces (`#F8FAFC`) with no shadow. Structural separation relies entirely on 1px solid borders (`#E2E8F0`).
- **Level 1 (Card / Table Container)**: Surface `#FFFFFF`, 1px solid `#E2E8F0`, shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)`.
- **Level 2 (Hover / Active Filter Popover)**: Surface `#FFFFFF`, 1px solid `#CBD5E1`, shadow: `0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)`.
- **Level 3 (Modal / Discrepancy Detail Drawer)**: Surface `#FFFFFF`, 1px solid `#CBD5E1`, shadow: `0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.03)`.
- **Anomaly Highlight Tier**: Red-flagged elements do not rely on elevation; they utilize an inset 2px border in `#DC2626` over a `#FEF2F2` tinted background to signal urgency without shifting grid geometry.

## Shapes

The design system employs a soft corner radius (`0.25rem` / 4px base) to convey rigor, institutional permanence, and analytical structure.

- **Base Controls (`0.25rem` / 4px)**: Buttons, text fields, checkboxes, data chips, and table headers.
- **Surface Containers (`rounded-lg` - `0.5rem` / 8px)**: Dashboard cards, OCR viewer wrappers, audit trail timeline panels, and modal shells.
- **Overlays & Drawers (`rounded-xl` - `0.75rem` / 12px)**: Floating action panels and contextual anomaly inspectors.
- **Pill Shape (`rounded-full`)**: Strictly reserved for count badges and binary status pills (e.g., "FLAGGED", "MATCHED").

## Components

- **Buttons**:
  - *Primary*: Background `#2563EB`, text `#FFFFFF`, radius 4px, font weight 600, height 36px. Hover state shifts to `#1D4ED8`. Active state `#1E40AF`. Focused with `2px` offset ring `#0EA5E9`.
  - *Destructive / Flag Fraud*: Background `#DC2626`, text `#FFFFFF`, hover `#B91C1C`.
  - *Secondary / Outline*: Background `#FFFFFF`, border 1px solid `#CBD5E1`, text `#0F172A`, hover `#F8FAFC`.
  - *Ghost / Table Action*: Background transparent, text `#475569`, hover `#F1F5F9`.

- **Form Inputs & Search Fields**:
  - Height 36px, border 1px solid `#CBD5E1`, background `#FFFFFF`, text `#0F172A`, placeholder `#94A3B8`.
  - Focus state: border `#2563EB`, outer ring 3px semi-transparent `rgba(37, 99, 235, 0.15)`.
  - Error / Failed Validation: border `#DC2626`, ring `rgba(220, 38, 38, 0.15)`.

- **Status Chips & Anomaly Badges**:
  - Padding `2px 8px`, border-radius 9999px, typography `label-sm`.
  - *High Risk / Fraud*: Border 1px solid `#FCA5A5`, background `#FEF2F2`, text `#991B1B`.
  - *Warning / Review*: Border 1px solid `#FCD34D`, background `#FFFBEB`, text `#92400E`.
  - *Cleared / Verified*: Border 1px solid `#6EE7B7`, background `#ECFDF5`, text `#065F46`.
  - *Neutral / Pending*: Border 1px solid `#E2E8F0`, background `#F8FAFC`, text `#475569`.

- **Checkboxes & Radios**:
  - Size 16px × 16px, border 1.5px solid `#94A3B8`, radius 3px (checkbox) or circular (radio).
  - Selected state: background `#2563EB`, border `#2563EB`, check icon `#FFFFFF`.

- **Data Tables & Ledger Rows**:
  - Header height 40px, background `#F8FAFC`, bottom border 1px solid `#E2E8F0`, typography `label-sm` in `#475569`.
  - Row height 44px, bottom border 1px solid `#F1F5F9`, typography `data-mono` for figures.
  - Alternating state: even rows white, odd rows `#F8FAFC` (optional density toggle).
  - Hover state: background `#F1F5F9`. Flagged anomaly row background tint: `#FEF2F2` with left edge border 3px solid `#DC2626`.

- **Specialized Component: OCR Receipt Inspector**:
  - Dual-pane container with synchronized split scroll. Left pane features the raw document scan with interactive bounding boxes (`border: 1.5px solid #0EA5E9; background: rgba(14, 165, 233, 0.1)`). Right pane presents extracted key-value pairs (Vendor, Tax ID, Date, Total Amount, Items). Clicking an extracted field highlights its corresponding physical bounding box on the left.

- **Specialized Component: Audit Trail Timeline**:
  - Vertical rail (2px line `#E2E8F0`). Node icons (20px circle) color-coded by event: Blue for system ingestion, Emerald for manual clearance, Red for fraud flags. Each event contains an author signature, ISO timestamp, diff snippet, and tamper-evident hash.