/**
 * Reports page data.
 *
 * Shaped the way the reporting endpoint is expected to answer, so the whole
 * object can be swapped for an API response without touching the components:
 *
 *   reportsData
 *   ├── dateRange
 *   ├── summary
 *   ├── participation
 *   ├── monthlyTrends
 *   ├── departments
 *   └── wellbeingInsights
 *
 * Icons are referenced by component and accent colours by palette key (`tone`),
 * which is resolved at render time from the active theme — see `usePalette()`.
 */
import {
  Users, CircleCheckBig, FileText, Star,
  Box, Code, Pencil, ChartNoAxesColumn, Megaphone, UsersRound,
  Brain, HeartPulse, Briefcase, Flame,
} from "lucide-react";

/** Ranges offered by the date picker; `custom` is filled in by the user. */
export const DATE_RANGE_PRESETS = [
  { id: "2024", label: "Jan 1, 2024 - Dec 31, 2024", from: "2024-01-01", to: "2024-12-31" },
  { id: "h2-2024", label: "Jul 1, 2024 - Dec 31, 2024", from: "2024-07-01", to: "2024-12-31" },
  { id: "q4-2024", label: "Oct 1, 2024 - Dec 31, 2024", from: "2024-10-01", to: "2024-12-31" },
  { id: "2023", label: "Jan 1, 2023 - Dec 31, 2023", from: "2023-01-01", to: "2023-12-31" },
];

/** Grouping offered by the chart's period dropdown. */
export const TREND_PERIODS = ["Monthly", "Quarterly"];

export const reportsData = {
  dateRange: DATE_RANGE_PRESETS[0],

  // Headline metrics. `change` is the delta against the comparison window.
  summary: [
    { id: "employees", label: "Total Employees", value: "845", change: 12, comparison: "vs. last year", icon: Users, tone: "teal" },
    { id: "participation", label: "EAP Participation", value: "68%", change: 8, comparison: "vs. last year", icon: CircleCheckBig, tone: "emerald" },
    { id: "assessments", label: "Assessment Completion", value: "72%", change: 14, comparison: "vs. last year", icon: FileText, tone: "violet" },
    { id: "wellbeing", label: "Average Wellbeing Score", value: "4.2 / 5", change: 6, comparison: "vs. last year", icon: Star, tone: "amber" },
  ],

  participation: {
    rate: 68,
    segments: [
      { id: "participating", label: "Participating", value: 575, pct: 68, tone: "emerald" },
      { id: "not-participating", label: "Not Participating", value: 222, pct: 26, tone: "brand" },
      { id: "not-invited", label: "Not Invited", value: 48, pct: 6, tone: "slateLight" },
    ],
  },

  // `participation` is a percentage (0-100); `wellbeing` is the 1-5 score.
  monthlyTrends: [
    { month: "Jan", quarter: "Q1", participation: 40, wellbeing: 2.4 },
    { month: "Feb", quarter: "Q1", participation: 49, wellbeing: 2.6 },
    { month: "Mar", quarter: "Q1", participation: 61, wellbeing: 2.7 },
    { month: "Apr", quarter: "Q2", participation: 70, wellbeing: 2.8 },
    { month: "May", quarter: "Q2", participation: 76, wellbeing: 3.0 },
    { month: "Jun", quarter: "Q2", participation: 71, wellbeing: 2.9 },
    { month: "Jul", quarter: "Q3", participation: 69, wellbeing: 2.8 },
    { month: "Aug", quarter: "Q3", participation: 75, wellbeing: 3.0 },
    { month: "Sep", quarter: "Q3", participation: 68, wellbeing: 2.9 },
    { month: "Oct", quarter: "Q4", participation: 76, wellbeing: 3.1 },
    { month: "Nov", quarter: "Q4", participation: 85, wellbeing: 3.2 },
    { month: "Dec", quarter: "Q4", participation: 96, wellbeing: 3.4 },
  ],

  departments: [
    { id: "product", name: "Product", employees: 120, participation: 80, wellbeing: 4.3, icon: Box, tone: "violet" },
    { id: "engineering", name: "Engineering", employees: 180, participation: 68, wellbeing: 4.1, icon: Code, tone: "rose" },
    { id: "design", name: "Design", employees: 80, participation: 65, wellbeing: 4.0, icon: Pencil, tone: "rose" },
    { id: "sales", name: "Sales", employees: 120, participation: 65, wellbeing: 3.9, icon: ChartNoAxesColumn, tone: "amber" },
    { id: "marketing", name: "Marketing", employees: 90, participation: 64, wellbeing: 4.1, icon: Megaphone, tone: "violet" },
    { id: "hr", name: "HR", employees: 60, participation: 78, wellbeing: 4.4, icon: UsersRound, tone: "teal" },
  ],

  // `direction` drives the arrow and its colour: "up" is an improvement.
  wellbeingInsights: [
    { id: "mental-health", title: "Mental Health", detail: "12% improvement vs. last year", direction: "up", icon: Brain, tone: "emerald" },
    { id: "stress", title: "Stress & Anxiety", detail: "8% improvement vs. last year", direction: "up", icon: HeartPulse, tone: "rose" },
    { id: "work-life", title: "Work-Life Balance", detail: "6% improvement vs. last year", direction: "up", icon: Briefcase, tone: "teal" },
    { id: "burnout", title: "Burnout Risk", detail: "6% decrease vs. last year", direction: "down", icon: Flame, tone: "amber" },
  ],
};

export const PRIVACY_NOTICE = {
  title: "Privacy Protected",
  detail:
    "Individual employee data is confidential and not visible to administrators. All reports show aggregated and anonymized insights only.",
};

/** Roll the monthly series up to quarters for the chart's period dropdown. */
export function trendsByPeriod(trends, period) {
  if (period !== "Quarterly") return trends.map((t) => ({ ...t, label: t.month }));
  const order = ["Q1", "Q2", "Q3", "Q4"];
  return order.map((quarter) => {
    const rows = trends.filter((t) => t.quarter === quarter);
    const mean = (key) => rows.reduce((sum, r) => sum + r[key], 0) / rows.length;
    return {
      label: quarter,
      quarter,
      participation: Math.round(mean("participation")),
      wellbeing: Number(mean("wellbeing").toFixed(1)),
    };
  });
}

export default reportsData;
