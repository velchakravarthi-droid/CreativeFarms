# Creative Farm App Build Plan

## Phase 1: Foundation

- Create the Next.js application.
- Add Supabase client setup.
- Add `.env.local` for real secrets and keep `.env.example` committed.
- Set up shared app layout for tablet-friendly use.
- Create base roles and permissions model.
- Create first Supabase schema migration.

## Phase 2: Farm Structure

- Create farm, zone, sub-zone, row, and tree-position tables.
- Build admin screens to manage zones, rows, and user-zone assignments.
- Seed the initial 125-acre structure.

## Phase 3: Daily Operations

- Build zone-first activity entry.
- Support irrigation, fertigation, pest observation, drip issue, labor, mortality, harvest, and utility activity.
- Keep forms short and mobile/tablet friendly.
- Store entries locally first when offline.

## Phase 4: Work Orders

- Add work order creation, assignment, due date, status, and completion notes.
- Support work order types for drip repair, pest spray, fertigation, replacement, harvest prep, maintenance, weed removal, and pruning.
- Add pending and overdue views.

## Phase 5: Inventory And Input Approval

- Add inventory items for fertilizer, chemicals, and supplies.
- Add purchase entries.
- Add usage plans.
- Add issue-confirm-use workflow.
- Reduce stock only after confirmed field usage.

## Phase 6: Labor, Equipment, And Costs

- Track worker attendance and activity costs.
- Track equipment usage and maintenance.
- Tag costs to zones where possible.
- Add cost per acre, labor cost per acre, fertilizer cost per acre, and equipment maintenance cost reporting.

## Phase 7: Harvest

- Add harvest batch creation.
- Track crop family, crop type, zone, date, quantity, labor cost, transport cost, and notes.
- Add harvest cost per kg and yield per acre reports.

## Phase 8: Offline Sync

- Add IndexedDB local queue for offline entries.
- Add sync status indicators.
- Sync queued entries to Supabase when online.
- Resolve duplicate submissions with client-generated IDs.

## Phase 9: Reports

- Build daily dashboard.
- Build weekly operations report.
- Build monthly cost and performance report.
- Build yearly profitability and productivity report.
- Add Excel/PDF exports after core reports are stable.

## First Vertical Slice

Build this first before adding every module:

1. User login
2. Zone list
3. Irrigation entry for selected rows
4. Work order for drip repair
5. Daily report showing irrigation completed and pending work
6. Deploy to Vercel

