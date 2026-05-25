# Supabase Schema Draft

This is the starting database model for the 125-acre farm operations app. It should be implemented as Supabase migrations once the app is scaffolded.

## Core Tables

### farms

- id
- name
- total_acres
- created_at

### zones

- id
- farm_id
- name
- acres
- notes
- created_at

### sub_zones

- id
- zone_id
- name
- acres
- notes
- created_at

### rows

- id
- zone_id
- sub_zone_id
- row_number
- tree_count
- drip_line_ref
- notes
- created_at

### tree_positions

- id
- row_id
- tree_number
- crop_family
- crop_type
- status
- planted_on
- notes
- created_at

Tree positions should be used for exceptions, not for every routine activity entry.

## Users And Access

### profiles

- id
- auth_user_id
- full_name
- role
- phone
- status
- created_at

### user_zone_assignments

- id
- profile_id
- zone_id
- created_at

Use this table to limit supervisors and field assistants to assigned zones.

## Operations

### activity_entries

- id
- client_id
- farm_id
- zone_id
- sub_zone_id
- row_start
- row_end
- activity_type
- status
- started_at
- ended_at
- equipment_id
- created_by
- notes
- created_at
- synced_at

Activity types include irrigation, fertigation, pest, drip_issue, labor, mortality, harvest, utility, and observation.

### tree_exceptions

- id
- tree_position_id
- exception_type
- severity
- observed_on
- created_by
- notes
- photo_url
- created_at

Exception types include mortality, fallen_tree, disease, replanting, and special_observation.

### work_orders

- id
- farm_id
- zone_id
- sub_zone_id
- row_start
- row_end
- type
- title
- description
- assigned_to
- due_date
- priority
- status
- created_by
- completed_by
- completed_at
- completion_notes
- created_at

## Inventory

### inventory_items

- id
- name
- category
- unit
- reorder_level
- current_stock
- created_at

Categories include fertilizer, chemical, seedling, spare_part, fuel, and general_supply.

### inventory_purchases

- id
- inventory_item_id
- quantity
- unit_cost
- vendor
- purchased_on
- created_by
- notes
- created_at

### input_usage_plans

- id
- zone_id
- inventory_item_id
- planned_quantity
- planned_for
- created_by
- approved_by
- status
- notes
- created_at

### inventory_issues

- id
- usage_plan_id
- inventory_item_id
- issued_quantity
- issued_by
- issued_to
- issued_at
- confirmed_quantity
- confirmed_by
- confirmed_at
- status
- notes

Stock should be reduced when field usage is confirmed.

## Labor And Equipment

### workers

- id
- full_name
- phone
- worker_type
- daily_rate
- status
- created_at

### labor_entries

- id
- zone_id
- activity_type
- worker_count
- total_cost
- work_date
- created_by
- notes
- created_at

### equipment

- id
- name
- equipment_type
- identifier
- status
- service_due_on
- notes
- created_at

### equipment_usage

- id
- equipment_id
- zone_id
- activity_type
- started_at
- ended_at
- hours_used
- fuel_used
- created_by
- notes
- created_at

### equipment_maintenance

- id
- equipment_id
- maintenance_type
- cost
- service_date
- next_service_due
- created_by
- notes
- created_at

## Harvest

### harvest_batches

- id
- batch_code
- zone_id
- crop_family
- crop_type
- harvest_date
- quantity_kg
- labor_cost
- transport_cost
- buyer
- sale_value
- created_by
- notes
- created_at

## Row-Level Security Direction

- Owner/admin can access all records.
- Farm manager can create, edit, and approve operational records.
- Field supervisor can read and write records for assigned zones.
- Field assistant can create daily entries for assigned zones.
- Stock person can manage inventory purchases and issues.
- Auditor/consultant has read-only access.

## Offline Sync Notes

- Use `client_id` UUIDs generated on the device to prevent duplicate synced records.
- Store offline changes in IndexedDB.
- Sync records in creation order.
- Show clear sync status on each device.
- Avoid destructive offline edits until the first version is stable.

