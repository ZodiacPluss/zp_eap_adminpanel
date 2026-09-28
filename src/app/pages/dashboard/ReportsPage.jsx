import React, { useCallback, useState } from "react";
import { Download } from "lucide-react";
import { PageShell } from "@/app/components/ui/PageShell";
import { Toast } from "@/app/components/ui/Toast";
import { PRIVACY_NOTICE, reportsData, TREND_PERIODS, trendsByPeriod } from "@/app/data/reportsData";
import { DateRangeSelector } from "@/app/components/reports/DateRangeSelector";
import { MetricCard } from "@/app/components/ui/MetricCard";
import { ProgramOverviewChart } from "@/app/components/reports/ProgramOverviewChart";
import { ParticipationChart } from "@/app/components/reports/ParticipationChart";
import { DepartmentInsights } from "@/app/components/reports/DepartmentInsights";
import { WellbeingInsights } from "@/app/components/reports/WellbeingInsights";
import { PrivacyBanner } from "@/app/components/ui/PrivacyBanner";

const csvCell = (value) => `"${String(value).replace(/"/g, '""')}"`;
const csvRows = (rows) => rows.map((row) => row.map(csvCell).join(",")).join("\n");

/**
 * Aggregated CSV of everything on the page. Built client-side from
 * `reportsData`; it becomes a plain download of the API payload once the
 * reporting endpoint is wired up.
 */
function buildReportCsv({ dateRange, period, data }) {
  const trends = trendsByPeriod(data.monthlyTrends, period);
  return [
    csvRows([["ZodiacPluss EAP Report"], ["Date range", dateRange.label], ["Grouping", period], []]),
    csvRows([["Summary"], ["Metric", "Value", "Change %", "Comparison"],
      ...data.summary.map((s) => [s.label, s.value, s.change, s.comparison]), []]),
    csvRows([["Participation"], ["Segment", "Employees", "Share %"],
      ...data.participation.segments.map((s) => [s.label, s.value, s.pct]), []]),
    csvRows([["Program overview"], ["Period", "EAP participation rate %", "Average wellbeing score"],
      ...trends.map((t) => [t.label, t.participation, t.wellbeing]), []]),
    csvRows([["Department insights"], ["Department", "Total employees", "Participation rate %", "Avg. wellbeing score"],
      ...data.departments.map((d) => [d.name, d.employees, d.participation, d.wellbeing]), []]),
    csvRows([["Wellbeing insights"], ["Focus area", "Detail", "Direction"],
      ...data.wellbeingInsights.map((w) => [w.title, w.detail, w.direction === "up" ? "Improving" : "Decreasing"])]),
  ].join("\n");
}

function downloadCsv(filename, contents) {
  const url = URL.createObjectURL(new Blob([contents], { type: "text/csv;charset=utf-8;" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState(reportsData.dateRange);
  const [period, setPeriod] = useState(TREND_PERIODS[0]);
  const [toast, setToast] = useState(null);
  const dismissToast = useCallback(() => setToast(null), []);

  const handleDownload = () => {
    downloadCsv(`zodiacpluss-eap-report-${dateRange.from}-to-${dateRange.to}.csv`,
      buildReportCsv({ dateRange, period, data: reportsData }));
    setToast({ message: "Report downloaded as CSV." });
  };

  return (
    <PageShell
      large
      title="Reports"
      sub="Get insights into your organization's wellbeing and EAP program impact."
      action={
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <DateRangeSelector value={dateRange} onChange={setDateRange} />
          <button type="button" onClick={handleDownload}
            className="flex h-[42px] items-center justify-center gap-2.5 rounded-lg bg-[var(--zp-brand)] px-5 text-[14px] font-medium text-[var(--zp-on-accent)] shadow-[0_1px_2px_var(--zp-shadow)] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--zp-brand)]/25">
            <Download className="h-[18px] w-[18px]" strokeWidth={1.9} aria-hidden="true" />
            Download Report
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {reportsData.summary.map((metric) => (
            <MetricCard key={metric.id} {...metric} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <ProgramOverviewChart trends={reportsData.monthlyTrends} period={period} onPeriodChange={setPeriod} />
          <ParticipationChart participation={reportsData.participation} />
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <DepartmentInsights departments={reportsData.departments} />
          <WellbeingInsights insights={reportsData.wellbeingInsights} />
        </div>

        <PrivacyBanner inline arrow={false} {...PRIVACY_NOTICE}
          onLearnMore={() => setToast({ message: "Privacy policy documentation is coming soon." })} />
      </div>

      <Toast toast={toast} onDismiss={dismissToast} />
    </PageShell>
  );
}
