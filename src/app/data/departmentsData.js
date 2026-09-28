/**
 * Departments directory data.
 *
 * Shaped like the future API rows so the array can be swapped for the response
 * without touching the components. Icons are referenced by component and accent
 * colours by palette key (`tone`), resolved at render time from the active
 * theme — see `usePalette()`.
 */
import { Settings, Box, Palette, ChartNoAxesColumn, Megaphone, UsersRound, Coins, Link2, Star } from "lucide-react";

export const DEPARTMENT_LOCATIONS = ["Bengaluru", "Mumbai", "Pune", "Delhi NCR", "Remote"];

export const DEPARTMENT_STATUSES = ["Active", "Inactive"];

export const DEPARTMENT_SORTS = [
  { id: "name-asc", label: "Name (A-Z)" },
  { id: "name-desc", label: "Name (Z-A)" },
  { id: "employees-desc", label: "Most Employees" },
  { id: "participation-desc", label: "Highest Participation" },
  { id: "wellbeing-desc", label: "Highest Wellbeing" },
];

/** Thresholds the participation and wellbeing meters are coloured against. */
export const PARTICIPATION_TARGET = 63;
export const WELLBEING_TARGET = 4.05;
/** The wellbeing meter is a 1-5 score, drawn as a share of full marks. */
export const WELLBEING_MAX = 5;

export const DEPARTMENTS_SUMMARY = [
  { id: "departments", label: "Total Departments", value: "8", change: 0, changeUnit: "", comparison: "vs. last quarter", icon: UsersRound, tone: "teal" },
  { id: "employees", label: "Total Employees", value: "845", change: 12, comparison: "vs. last quarter", icon: UsersRound, tone: "emerald" },
  { id: "participation", label: "Avg. EAP Participation", value: "68%", change: 8, comparison: "vs. last quarter", icon: ChartNoAxesColumn, tone: "violet" },
  { id: "wellbeing", label: "Avg. Wellbeing Score", value: "4.2 / 5", change: 6, comparison: "vs. last quarter", icon: Star, tone: "amber" },
];

export const DEPARTMENT_ROWS = [
  { id: "engineering", name: "Engineering", description: "Product development and technology", employees: 180, participation: 72, wellbeingScore: 4.3, manager: "Rahul Kapoor", location: "Bengaluru", status: "Active", icon: Settings, tone: "teal" },
  { id: "product", name: "Product", description: "Product strategy and management", employees: 120, participation: 65, wellbeingScore: 4.1, manager: "Sneha Gupta", location: "Bengaluru", status: "Active", icon: Box, tone: "violet" },
  { id: "design", name: "Design", description: "UI/UX and creative design", employees: 80, participation: 62, wellbeingScore: 4.0, manager: "Amit Mehta", location: "Pune", status: "Active", icon: Palette, tone: "rose" },
  { id: "sales", name: "Sales", description: "Business development and sales", employees: 120, participation: 58, wellbeingScore: 3.9, manager: "Priya Sharma", location: "Mumbai", status: "Active", icon: ChartNoAxesColumn, tone: "amber" },
  { id: "marketing", name: "Marketing", description: "Branding and marketing", employees: 90, participation: 64, wellbeingScore: 4.1, manager: "Neha Dutta", location: "Mumbai", status: "Active", icon: Megaphone, tone: "violet" },
  { id: "hr", name: "Human Resources", description: "People and culture", employees: 60, participation: 78, wellbeingScore: 4.4, manager: "Arjun Khanna", location: "Delhi NCR", status: "Active", icon: UsersRound, tone: "rose" },
  { id: "finance", name: "Finance", description: "Finance and accounting", employees: 70, participation: 66, wellbeingScore: 4.2, manager: "Rohan Talwar", location: "Delhi NCR", status: "Active", icon: Coins, tone: "amber" },
  { id: "operations", name: "Operations", description: "Operations and administration", employees: 125, participation: 61, wellbeingScore: 4.0, manager: "Kavya Menon", location: "Remote", status: "Inactive", icon: Link2, tone: "teal" },
];

export const DEPARTMENTS_PRIVACY_NOTICE = {
  title: "Confidential & Aggregated Data",
  detail:
    "All department insights show only aggregated and anonymized data. Individual employee responses and counselling details remain confidential.",
};

/** Search, filter and sort the directory. Pure, so it can move server-side later. */
export function filterDepartments(rows, { query = "", departmentId = "all", location = "all", sort = "name-asc" } = {}) {
  const needle = query.trim().toLowerCase();
  const matched = rows.filter((row) => {
    if (departmentId !== "all" && row.id !== departmentId) return false;
    if (location !== "all" && row.location !== location) return false;
    if (!needle) return true;
    return `${row.name} ${row.manager} ${row.description}`.toLowerCase().includes(needle);
  });

  const byName = (a, b) => a.name.localeCompare(b.name);
  const compare = {
    "name-asc": byName,
    "name-desc": (a, b) => byName(b, a),
    "employees-desc": (a, b) => b.employees - a.employees || byName(a, b),
    "participation-desc": (a, b) => b.participation - a.participation || byName(a, b),
    "wellbeing-desc": (a, b) => b.wellbeingScore - a.wellbeingScore || byName(a, b),
  }[sort];

  return compare ? [...matched].sort(compare) : matched;
}

export default DEPARTMENT_ROWS;
