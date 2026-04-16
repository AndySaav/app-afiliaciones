type StatusBadgeProps = {
  children: string;
};

export function StatusBadge({ children }: StatusBadgeProps) {
  const tone =
    children === "Afiliado" || children === "Completo"
      ? "is-positive"
      : children === "Rechazado"
        ? "is-negative"
        : "is-neutral";

  return <span className={`status-badge ${tone}`}>{children}</span>;
}
