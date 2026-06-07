import {
  BarChart3,
  CalendarCheck,
  CircleDollarSign,
  ClipboardList,
  Database,
  Droplets,
  Gauge,
  Hammer,
  RefreshCcw,
  ShieldAlert,
  Package,
  ShieldCheck,
  Sprout,
  Tractor,
  TreePalm,
  Users
} from "lucide-react";

export const navItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "planning", label: "Work Plan", icon: CalendarCheck },
  { id: "structure", label: "Farm Structure", icon: TreePalm },
  { id: "irrigation", label: "Irrigation", icon: Droplets },
  { id: "fertigation", label: "Fertigation", icon: Sprout },
  { id: "pest", label: "Pest / Disease", icon: ShieldAlert },
  { id: "exceptions", label: "Tree Issues", icon: TreePalm },
  { id: "labor", label: "Labor", icon: Users },
  { id: "stock", label: "Stock", icon: Package },
  { id: "harvest", label: "Harvest", icon: ClipboardList },
  { id: "equipment", label: "Equipment", icon: Tractor },
  { id: "workorders", label: "Work Orders", icon: Hammer },
  { id: "approvals", label: "Input Approval", icon: ShieldCheck },
  { id: "costs", label: "Farm Costs", icon: CircleDollarSign },
  { id: "reports", label: "Reports", icon: Gauge },
  { id: "users", label: "Users & Roles", icon: Users },
  { id: "sync", label: "Sync & Backup", icon: RefreshCcw },
  { id: "admin", label: "Admin", icon: ShieldCheck },
  { id: "database", label: "Database", icon: Database }
];

export const farmBlocks = [
  { name: "South Block", acres: 28, rows: 18, status: "Active" },
  { name: "North West Block", acres: 22, rows: 14, status: "Active" },
  { name: "East Block", acres: 35, rows: 24, status: "Active" },
  { name: "Stock Yard", acres: 2, rows: 2, status: "Active" },
  { name: "Equipment Yard", acres: 3, rows: 2, status: "Active" }
];

export const workers = [
  { name: "Farm Owner", role: "Admin", area: "All sections" },
  { name: "Farm Manager", role: "Manager", area: "Structure, stock, harvest, entries" },
  { name: "Supervisor 1", role: "User", area: "South Block entries" },
  { name: "Supervisor 2", role: "User", area: "East Block entries" },
  { name: "Stock Person", role: "Manager", area: "Stock and input issue" },
  { name: "Ramesh", role: "User", area: "Repair work entries" },
  { name: "Team 1", role: "User", area: "Daily labor entries" }
];

export const stockItems = [
  { name: "Urea", category: "Fertilizer", type: "Nitrogen", qty: "420 kg", status: "Healthy" },
  { name: "MOP / Potassium Chloride", category: "Fertilizer", type: "Potassium", qty: "165 kg", status: "Low" },
  { name: "19-19-19", category: "Fertilizer", type: "NPK complex", qty: "48 kg", status: "Reorder" },
  { name: "Neem oil", category: "Crop Protection", type: "Bio pesticide", qty: "36 L", status: "Low" },
  { name: "Diesel", category: "Fuel", type: "Diesel", qty: "210 L", status: "Healthy" }
];

export const costTypes = [
  "Labor salary",
  "Labor bonus / advance",
  "Stock purchase",
  "Fertilizer / chemical use",
  "Irrigation utility",
  "Equipment fuel",
  "Equipment repair",
  "Drip / field repair",
  "Harvest packing / transport",
  "Tree replacement",
  "Admin / office",
  "Miscellaneous"
];
