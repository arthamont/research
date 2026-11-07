export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-4 w-40 bg-border" />
      <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 bg-bg-elevated" />
        ))}
      </div>
      <div className="grid gap-px border border-border bg-border lg:grid-cols-2">
        <div className="h-64 bg-bg-elevated" />
        <div className="h-64 bg-bg-elevated" />
      </div>
    </div>
  );
}
