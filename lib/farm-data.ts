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
  { id: "dashboard", label: "Dashboard", href: "/", icon: BarChart3 },
  { id: "planning", label: "Work Plan", href: "/work-plan", icon: CalendarCheck },
  { id: "structure", label: "Farm Structure", href: "/farm-structure", icon: TreePalm },
  { id: "irrigation", label: "Irrigation", href: "/irrigation", icon: Droplets },
  { id: "fertigation", label: "Fertigation", href: "/fertigation", icon: Sprout },
  { id: "pest", label: "Pest / Disease", href: "/pest-disease", icon: ShieldAlert },
  { id: "labor", label: "Labor", href: "/labor", icon: Users },
  { id: "stock", label: "Stock", href: "/stock", icon: Package },
  { id: "harvest", label: "Harvest", href: "/harvest", icon: ClipboardList },
  { id: "equipment", label: "Equipment", href: "/equipment", icon: Tractor },
  { id: "workorders", label: "Work Orders", href: "/work-orders", icon: Hammer },
  { id: "approvals", label: "Input Approval", href: "/input-approval", icon: ShieldCheck },
  { id: "costs", label: "Farm Costs", href: "/farm-costs", icon: CircleDollarSign },
  { id: "reports", label: "Reports", href: "/reports", icon: Gauge },
  { id: "users", label: "Users & Roles", href: "/users-roles", icon: Users },
  { id: "sync", label: "Sync & Backup", href: "/sync-backup", icon: RefreshCcw },
  { id: "admin", label: "Admin", href: "/admin", icon: ShieldCheck },
  { id: "database", label: "Database", href: "/database", icon: Database }
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

export const farmProperties = [
  { type: "Tree", name: "Water Coconut", quantity: "" },
  { type: "Tree", name: "Nilembu Timber", quantity: "" },
  { type: "Tree", name: "Alphonso Mango", quantity: "" },
  { type: "Equipment", name: "Tractor", quantity: "3" },
  { type: "Equipment", name: "JCB", quantity: "1" },
  { type: "Equipment", name: "Water Tank", quantity: "6" },
  { type: "Equipment", name: "Trailer", quantity: "4" }
];

export const treeTypeAssignments = [
  { propertyType: "Tree", propertyName: "Water Coconut", block: "All Blocks", row: "All Rows", count: 14500 },
  { propertyType: "Tree", propertyName: "Water Coconut", block: "South Block", row: "Row 1-3", count: 1265 },
  { propertyType: "Tree", propertyName: "Nilembu Timber", block: "North West Block", row: "Row 1-2", count: 515 },
  { propertyType: "Tree", propertyName: "Alphonso Mango", block: "East Block", row: "Row 1-2", count: 595 }
];
