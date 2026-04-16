type StatCardProps = {
  label: string;
  value: number;
  tone?: "default" | "warning";
};

export function StatCard({ label, value, tone = "default" }: StatCardProps) {
  return (
    <article className={`stat-card ${tone === "warning" ? "is-warning" : ""}`}>
      <p>{label}</p>
      <strong>{value}</strong>
    </article>
  );
}
