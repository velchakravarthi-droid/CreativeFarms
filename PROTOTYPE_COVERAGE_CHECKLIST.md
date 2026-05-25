# Prototype Coverage Checklist

This checklist maps the 11 prompt sections to visible prototype coverage.

| Prompt Section | Prototype Coverage |
| --- | --- |
| 1. Land structure must be stronger | `Farm Structure` screen shows Farm -> Block -> Plot -> Rows, tracking level purposes, block acres, plots, row coverage, planted tree type, and tree count. |
| 2. Data entry should be mostly zone-wise, not tree-wise | Entry forms start with Date, Zone, and Row / Row Range. `Tree Issues` is separated for exception-only tree tracking. |
| 3. Work planning, not just data entry | `Work Plan` screen covers today's irrigation plan, labor plan, pending drip repair, pest treatment, fertigation schedule, harvest schedule, equipment service, and stock alerts. |
| 4. User roles become more important | `Users & Roles` screen includes the role access matrix and user-zone assignments. |
| 5. Storage recommendation | `Sync & Backup` screen shows offline local storage, cloud sync, backup, export, device sync queue, and lost-device protection. |
| 6. Best data entry design | `Today's Work` uses quick action selection. Entry forms use Zone, Row / Row Range, simple status fields, remarks, save, and photo actions. |
| 7. Additional modules | `Work Orders`, `Input Approval`, `Zone Costs`, `Harvest`, `Equipment`, and `Stock` screens cover the added mid-size farm modules. |
| 8. Management-level reporting | `Reports` screen covers daily, weekly, monthly, and yearly report categories plus decision-focused management questions. |
| 9. Cost-focused metrics | `Reports` and `Zone Costs` include cost per acre, labor per acre, fertilizer per acre, yield per acre, mortality, irrigation hours, maintenance cost, harvest cost/kg, and stock variance. |
| 10. Revised architecture | `Sync & Backup` screen shows farm devices -> offline storage -> cloud sync -> owner dashboard/report exports. |
| 11. Final recommendation | Overall navigation and dashboard now reflect block/plot/row-wise operations, tree type assignment, configurable farm property master, tree-exception tracking, batch harvest, stock approval, worker labor, equipment utility, role access, and reports. |

## Remaining Build Notes

- The prototype is static and uses sample data only.
- Real Supabase auth, row-level security, IndexedDB, and sync logic will be implemented during the application build.
- The browser prototype intentionally shows workflow coverage before backend implementation.
- Each left navigation module now has either a right-side entry form, setup form, filter form, or action panel so the main workspace changes based on the selected module.
