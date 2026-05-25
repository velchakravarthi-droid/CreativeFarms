# Creative Farm App Product Spec

## Purpose

Creative Farm App is a mid-size farm operations system for a 125-acre farm. It should help managers plan work, collect field data, control input usage, track costs, and produce daily, weekly, monthly, and yearly reports.

The app should be simple, tablet-friendly, low-cost, and practical for field use. It should work offline during farm operations and sync with the cloud when internet access is available.

## Core Principle

The farm should not be managed only tree-wise.

Operational tracking should be:

- Zone-wise for regular work
- Row-wise for field issues
- Tree-wise only for exceptions
- Batch-wise for harvest
- Stock-wise for fertilizer and chemicals
- Worker-wise for labor
- Equipment-wise for utility and maintenance

## Land Hierarchy

Recommended structure:

```text
Farm
  Block / Zone
    Sub-zone / Plot
      Row
        Tree position
```

Example:

```text
Farm: 125 Acres
  Zone A: 20 Acres
    Sub-zone A1: 5 Acres
      Row 1
      Row 2
      Row 3
  Zone B: 15 Acres
  Zone C: 25 Acres
```

## Tracking Levels

| Level | Purpose |
| --- | --- |
| Farm | Overall reporting |
| Zone / Block | Main operational unit |
| Sub-zone / Plot | Easier field management |
| Row | Tree, drip, and irrigation tracking |
| Tree position | Exception tracking only |

## Data Entry Strategy

Regular entries should be zone-wise or row-wise:

- Irrigation
- Fertigation
- Pest observation
- Drip condition
- Soil moisture
- Leaf color
- Growth condition
- Labor activity
- Utility usage
- Fertilizer usage

Tree-wise entries should be used only for exceptions:

- Fallen tree
- Dead tree / mortality
- Replanting
- Disease-affected tree
- Special observation
- High-value tree tracking

## Main Workflows

### Daily Field Entry

1. Select zone
2. Select activity
3. Enter simple status
4. Add issue notes or photos if needed
5. Save offline
6. Sync when connected

Example:

```text
Zone A
Rows 1-20
Irrigation completed: Yes
Start time: 6:00 AM
End time: 8:30 AM
Motor used: Bore Motor 2
Issue: No
```

### Work Planning

The app must support both what happened today and what needs to happen next.

Important planning screens:

- Today's irrigation plan
- Today's labor plan
- Pending drip repair
- Pending pest treatment
- Fertigation schedule
- Harvest schedule
- Equipment service due
- Fertilizer stock low alert

### Work Orders

Work orders should cover:

- Drip repair
- Pest spray
- Fertigation
- Tree replacement
- Harvest preparation
- Equipment maintenance
- Weed removal
- Pruning

Example:

```text
Work Order: Drip repair
Zone: B
Rows: 10-15
Assigned to: Ramesh
Due date: Tomorrow
Status: Pending / In Progress / Completed
```

### Input Usage Approval

Fertilizer and chemical stock should not be reduced manually without workflow.

Recommended flow:

```text
Manager creates usage plan
Stock person issues fertilizer
Field worker confirms usage
System reduces stock
```

### Harvest Batch Tracking

Harvest should be batch-wise.

Example:

```text
Harvest Batch: HB-2026-07-ZoneA-Mango
Tree Family: Mango
Tree Type: Alphonso
Zone: A
Harvest Date: July 15
Quantity: 2500 kg
Labor cost: 18000
Transport cost: 7000
```

## User Roles

| Role | Access |
| --- | --- |
| Labor / Field Assistant | Add daily entries only |
| Field Supervisor | Add and review entries for assigned zones |
| Farm Manager | Edit entries and approve work completion |
| Store / Stock Person | Add purchases and issue fertilizer or chemical stock |
| Owner / Admin | Full access, delete/cancel, reports |
| Auditor / Consultant | View-only access |

Each user should be assigned to specific zones where applicable.

## Reports

### Daily Report

- Which zones were irrigated
- Which zones missed irrigation
- Pest observations
- Labor used
- Fertilizer used
- Equipment used
- Urgent issues

### Weekly Report

- Growth condition by zone
- Pending drip repairs
- Soil moisture issues
- Pest trend
- Labor cost by activity
- Work completed vs pending

### Monthly Report

- Fertilizer purchased vs used
- Labor cost
- Utility cost
- Mortality count
- Yield estimate
- Harvest completed
- Zone-wise performance

### Yearly Report

- Total yield
- Total farm cost
- Cost per acre
- Yield per acre
- Fertilizer cost per acre
- Labor cost per acre
- Mortality percentage
- Most productive zone
- Least productive zone

## Cost Metrics

| Metric | Purpose |
| --- | --- |
| Cost per acre | Basic farm profitability |
| Labor cost per acre | Labor efficiency |
| Fertilizer cost per acre | Input cost control |
| Yield per acre | Productivity |
| Mortality percentage | Plantation health |
| Irrigation hours per acre | Water usage control |
| Maintenance cost per equipment | Utility efficiency |
| Harvest cost per kg | Profitability |
| Stock variance | Leakage and waste control |

## Architecture Recommendation

```text
Farm tablets / iPads / laptops
        ↓
Offline-first PWA
        ↓
Local device database
        ↓
Sync engine
        ↓
Cloud database
        ↓
Owner dashboard
        ↓
Reports / Excel / PDF
```

## Suggested Stack

| Layer | Recommendation |
| --- | --- |
| App | Next.js / React PWA |
| Offline storage | IndexedDB |
| Backend | Supabase |
| Database | PostgreSQL |
| Hosting | Vercel |
| Auth | Supabase Auth with role-based access |
| Reports | Dashboard plus Excel/PDF export |
| Backup | Supabase backups plus monthly export |

